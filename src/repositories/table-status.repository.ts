import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TableStatus, TableStatusRelations} from '../models';

export class TableStatusRepository extends DefaultCrudRepository<
  TableStatus,
  typeof TableStatus.prototype.status_code,
  TableStatusRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(TableStatus, dataSource);
  }
}
