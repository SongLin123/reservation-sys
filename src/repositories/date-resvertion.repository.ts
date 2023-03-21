import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {TableStatusRepository} from '.';
import {DbDataSource} from '../datasources';
import {DateReservation, DateReservationRelations, Tables, TableStatus} from '../models';
import {TablesRepository} from './tables.repository';

export class DateReservationRepository extends DefaultCrudRepository<
  DateReservation,
  typeof DateReservation.prototype.id,
  DateReservationRelations
> {


  tables: BelongsToAccessor<Tables, typeof DateReservation.prototype.id>;
  tableStatus: BelongsToAccessor<TableStatus, typeof DateReservation.prototype.id>;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TablesRepository')
    tablesRepositoryGetter?: Getter<TablesRepository>,
    @repository.getter('TableStatusRepository')
    tableStatusRepositoryGetter?: Getter<TableStatusRepository>,
  ) {
    super(DateReservation, dataSource);


    // we already have this line to create a BelongsToRepository factory
    this.tables = this.createBelongsToAccessorFor(
      'tables',
      tablesRepositoryGetter!,
    );

    // add this line to register inclusion resolver.
    this.registerInclusionResolver('tables', this.tables.inclusionResolver);

    // we already have this line to create a BelongsToRepository factory
    this.tableStatus = this.createBelongsToAccessorFor(
      'tableStatus',
      tableStatusRepositoryGetter!,
    );

    // add this line to register inclusion resolver.
    this.registerInclusionResolver('tableStatus', this.tableStatus.inclusionResolver);
  }

}
