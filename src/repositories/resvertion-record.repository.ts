import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DateReservationRepository, MyUserRepository} from '.';
import {DbDataSource} from '../datasources';
import {DateReservation, MyUser, ReservationRecord, ReservationRecordRelations} from '../models';

export class ReservationRecordRepository extends DefaultCrudRepository<
  ReservationRecord,
  typeof ReservationRecord.prototype.id,
  ReservationRecordRelations
> {

  public readonly guest_user: BelongsToAccessor<
    MyUser,
    typeof ReservationRecord.prototype.id
  >;

  public readonly last_modifiy_employe: BelongsToAccessor<
    MyUser,
    typeof ReservationRecord.prototype.id
  >;

  public readonly date_reservation: BelongsToAccessor<
    DateReservation,
    typeof ReservationRecord.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,

    @repository.getter('MyUserRepository')
    protected myUserRepositoryGetter?: Getter<MyUserRepository>,
    @repository.getter('DateReservationRepository')
    protected dateReservationRepositoryGetter?: Getter<DateReservationRepository>,
  ) {
    super(ReservationRecord, dataSource);

    this.guest_user = this.createBelongsToAccessorFor(
      'guest_user',
      myUserRepositoryGetter!,
    );
    this.registerInclusionResolver(
      'guest_user',
      this.guest_user.inclusionResolver,
    );

    this.last_modifiy_employe = this.createBelongsToAccessorFor(
      'last_modifiy_employe',
      myUserRepositoryGetter!,
    );
    this.registerInclusionResolver(
      'last_modifiy_employe',
      this.last_modifiy_employe.inclusionResolver,
    );

    this.date_reservation = this.createBelongsToAccessorFor(
      'date_reservation',
      dateReservationRepositoryGetter!,
    );
    this.registerInclusionResolver(
      'date_reservation',
      this.date_reservation.inclusionResolver,
    );
  }

}
