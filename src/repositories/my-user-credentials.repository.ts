// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {MyUserCredentials, MyUserCredentialsRelations} from '../models';

export class MyUserCredentialsRepository extends DefaultCrudRepository<
  MyUserCredentials,
  typeof MyUserCredentials.prototype.id,
  MyUserCredentialsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(MyUserCredentials, dataSource);
  }
}
