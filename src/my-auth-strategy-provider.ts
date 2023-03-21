
import {AuthenticationStrategy} from '@loopback/authentication';
import {JWTAuthenticationStrategy} from '@loopback/authentication-jwt';
import {Getter, inject, injectable} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';

// 校验身份是否是guest
@injectable()
export class MyAuthStrategyProvider implements AuthenticationStrategy {
  name = 'myjwt';

  constructor(
    @inject.getter('authentication.strategies.JWTAuthenticationStrategy')
    private jwtStrategy: Getter<JWTAuthenticationStrategy>
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {

    const jwtUserProfile = await (await this.jwtStrategy()).authenticate(request);

    if (jwtUserProfile) {


      return jwtUserProfile;
    } else {
      throw new HttpErrors[401](`Invalid jwt`);
    }

  }



}
