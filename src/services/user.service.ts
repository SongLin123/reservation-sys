import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Principal, securityId} from '@loopback/security';
import {compareSync} from 'bcryptjs';
import {MyUser, MyUserWithRelations} from '../models';
// User --> MyUser
// UserRepository --> MyUserRepository
import {MyUserRepository} from '../repositories';

export type Credentials = {
  is_guest: boolean;
  user_name: string;
  password: string;
};

export interface MyUserProfile extends Principal {
  [securityId]: string,
  user_name: string,
  id: string,
  is_guest: boolean,
  guest_profile: any;
}

// User --> MyUser
export class MyUserService implements UserService<MyUser, Credentials> {
  constructor(
    // UserRepository --> MyUserRepository
    @repository(MyUserRepository) public userRepository: MyUserRepository,
  ) { }

  // User --> MyUser
  async verifyCredentials(credentials: Credentials): Promise<MyUser> {
    const invalidCredentialsError = 'Invalid user_name or password or user identity';

    const foundUser = await this.userRepository.findOne({
      where: {user_name: credentials.user_name},
    });
    if (!foundUser) {
      throw new HttpErrors[406](invalidCredentialsError);
    }


    if (foundUser.is_guest !== credentials.is_guest) {
      throw new HttpErrors[406](invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors[406](invalidCredentialsError);
    }

    const passwordMatched = compareSync(
      credentials.password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors[406](invalidCredentialsError);
    }

    return foundUser;
  }

  // User --> MyUser
  convertToUserProfile(user: MyUser): MyUserProfile {
    return {
      [securityId]: user.id.toString(),
      user_name: user.user_name,
      id: user.id,
      is_guest: user.is_guest,
      guest_profile: user.guest_profile
    };
  }

  //function to find user by id
  async findUserById(id: string): Promise<MyUser & MyUserWithRelations> {
    const userNotfound = 'invalid User';
    const foundUser = await this.userRepository.findOne({
      where: {id: id},
    });

    if (!foundUser) {
      throw new HttpErrors[406](userNotfound);
    }
    return foundUser;
  }
}
