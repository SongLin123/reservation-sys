import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {RecordStatus, RecordStatusRelations} from '../models';

export class RecordStatusRepository extends DefaultCrudRepository<
  RecordStatus,
  typeof RecordStatus.prototype.status_code,
  RecordStatusRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(RecordStatus, dataSource);
  }
}
