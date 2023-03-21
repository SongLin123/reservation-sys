import {AuthenticationStrategy} from '@loopback/authentication';
import {JWTAuthenticationStrategy, UserServiceBindings} from '@loopback/authentication-jwt';
import {Getter, inject, injectable} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {MyUserProfile, MyUserService} from './services/user.service';
// 校验身份是否是guest
@injectable()
export class IsGuestAuthenticationStrategy implements AuthenticationStrategy {
  name = 'isGuest';

  constructor(
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,

    @inject.getter('authentication.strategies.JWTAuthenticationStrategy')
    private jwtStrategy: Getter<JWTAuthenticationStrategy>
  ) { }

  async authenticate(request: Request): Promise<MyUserProfile | undefined> {

    const jwtUserProfile = await (await this.jwtStrategy()).authenticate(request);

    if (jwtUserProfile) {
      const foundUser = await this.userService.findUserById(
        jwtUserProfile[securityId],
      );
      if (!foundUser) {
        throw new HttpErrors[404](`User not found with id ${jwtUserProfile[securityId]}`);
      }

      // 用户是否是guest
      if (!foundUser.is_guest) {
        throw new HttpErrors[405](`Invalid credentials not guest`);

      }
      const profile = await this.userService.convertToUserProfile(
        foundUser
      );

      return profile;
    } else {
      throw new HttpErrors[401](`Invalid jwt`);
    }

  }



}
