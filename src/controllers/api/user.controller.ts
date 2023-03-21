import {authenticate, TokenService} from '@loopback/authentication';
import {
  RefreshTokenService,
  RefreshTokenServiceBindings,
  TokenObject,
  TokenServiceBindings,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  api,
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings, securityId} from '@loopback/security';
import {genSaltSync, hashSync} from 'bcryptjs';
import _ from 'lodash';
import {MyUser} from '../../models';
import {NewUserRequest} from '../../models/new-user-request.model';
import {MyUserRepository} from '../../repositories';
import {Credentials, MyUserProfile, MyUserService} from '../../services/user.service';



const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['user_name', 'password'],
  properties: {
    user_name: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    is_guest: {
      type: 'boolean',
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};



type RefreshGrant = {
  refreshToken: string;
};

// Describes the schema of grant object
const RefreshGrantSchema: SchemaObject = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
    },
  },
};

// Describes the request body of grant object
const RefreshGrantRequestBody = {
  description: 'Reissuing Acess Token',
  required: true,
  content: {
    'application/json': {schema: RefreshGrantSchema},
  },
};
@api({basePath: "/api"})
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: MyUserProfile,
    @repository(MyUserRepository) protected userRepository: MyUserRepository,
    @inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
    public refreshService: RefreshTokenService,
  ) { }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a MyUser object into a MyUserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('myjwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(): Promise<MyUserProfile> {
    const user = await this.userService.findUserById(this.user[securityId]);
    return this.userService.convertToUserProfile(user);
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'MyUser',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': MyUser,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            partial: "deep",
            exclude: ['id']
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<MyUser> {

    if (
      await this.userRepository.findUserByUserName(newUserRequest.user_name)
    ) {
      throw new HttpErrors[406]("用户名已存在");
    }

    if (
      newUserRequest.is_guest && (!newUserRequest.guest_profile || _.isEmpty(newUserRequest.guest_profile))
    ) {
      throw new HttpErrors[406]("请填写客人信息");
    }


    const password = hashSync(newUserRequest.password, genSaltSync());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }


  /**
 * A login function that returns refresh token and access token.
 * @param credentials User email and password
 */
  @post('/users/refresh-login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
                refreshToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async refreshLogin(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<TokenObject> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile: MyUserProfile =
      this.userService.convertToUserProfile(user);
    const accessToken = await this.jwtService.generateToken(userProfile);
    const tokens = await this.refreshService.generateToken(
      userProfile,
      accessToken,
    );
    return tokens;
  }

  @post('/refresh', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async refresh(
    @requestBody(RefreshGrantRequestBody) refreshGrant: RefreshGrant,
  ): Promise<TokenObject> {
    return this.refreshService.refreshToken(refreshGrant.refreshToken);
  }
}
