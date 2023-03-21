import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {MyUser, MyUserCredentials, MyUserRelations} from '../models';

// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Getter, inject} from '@loopback/core';
import {
  HasOneRepositoryFactory, repository
} from '@loopback/repository';
import {MyUserCredentialsRepository} from './my-user-credentials.repository';

export class MyUserRepository extends DefaultCrudRepository<
  MyUser,
  typeof MyUser.prototype.id,
  MyUserRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    MyUserCredentials,
    typeof MyUser.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,

    @repository.getter('MyUserCredentialsRepository')
    protected userCredentialsRepositoryGetter?: Getter<MyUserCredentialsRepository>,
  ) {
    super(MyUser, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter!,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }

  async findCredentials(
    userId: typeof MyUser.prototype.id,
  ): Promise<MyUserCredentials | undefined> {
    return this.userCredentials(userId)
      .get()
      .catch(err => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  }

  async findUserByUserName(user_name: typeof MyUser.prototype.user_name,): Promise<MyUser | null> {
    return this.findOne({where: {user_name: user_name}})
  }
}
