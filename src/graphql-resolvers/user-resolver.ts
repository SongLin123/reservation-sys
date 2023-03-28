// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  arg, mutation, query,
  resolver,
  root,
  subscription
} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {GuestProfile, MyUser, NewUserRequest} from '../models';
import {MyUserRepository} from '../repositories';
import {MyUserService} from '../services/user.service';

@resolver(of => MyUser)
export class UserResolver {
  constructor(

    @repository(MyUserRepository) public userRepository: MyUserRepository,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
  ) { }

  @query(returns => MyUser, {nullable: true})
  async user(@arg('id') id: string) {
    return this.userRepository.findById(id)
  }

  @query(returns => [MyUser])
  async users(): Promise<MyUser[]> {
    return this.userRepository.find({
      order: ['is_guest']
    });
  }


  @mutation(returns => MyUser)
  async addUser(
    @arg('userReq') userReq: NewUserRequest,
  ): Promise<MyUser> {
    const result = await this.userService.createUser(userReq)

    return result;
  }

  @subscription(returns => MyUser, {topics: 'userCreated'})
  async recipeCreated(@root() user: MyUser) {
    return user;
  }

  @mutation(returns => MyUser)
  async updateUserState(
    @arg('id') id: string,
    @arg('state') state: string,

  ): Promise<MyUser> {
    await this.userRepository.updateById(id, {state})

    const result = await this.userRepository.findById(id)
    return result;
  }

  @mutation(returns => MyUser)
  async updateUserProfile(
    @arg('id') id: string,
    @arg('guest_profile') guest_profile: GuestProfile,

  ): Promise<MyUser> {
    await this.userRepository.updateById(id, {guest_profile})

    const result = await this.userRepository.findById(id)
    return result;
  }

}
