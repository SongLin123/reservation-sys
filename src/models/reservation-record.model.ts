import {belongsTo, Entity, model, property} from '@loopback/repository';
import {DateReservation} from './date-reservation.model';
import {MyUser} from './my-user.model';
import {RecordStatusEnum} from './record-status.model';

@model({settings: {strict: false}})
export class ReservationRecord extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  // @property({
  //   type: 'string',
  //   required: true,
  //   description: '客人姓名',
  // })
  // guest_name: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // guest_user_id: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // guest_contact_info: string;



  @property({
    type: 'string',
    required: false,
    default: RecordStatusEnum.APPOINTMENT_IN_PROGRESS,
    updateOnCreate: true
  })
  record_status: string;



  @property({
    type: 'date',
    required: true,
    defaultFn: 'now',
    updateOnCreate: true
  })
  create_time: string;

  @property({
    type: 'date',
    required: true,
    defaultFn: 'now',
    updateOnCreate: true,
    updateOnUpdate: true
  })
  last_update_time: string;


  // description: '预定客人的用户id',
  @belongsTo(() => MyUser, {keyTo: 'id', name: "guest_user"})
  guest_user_id: string

  // description: '关联时间',
  @belongsTo(() => DateReservation, {keyTo: 'id', name: "date_reservation"})
  date_reservation_id: string;

  // description: '修改人',
  @belongsTo(() => MyUser, {keyTo: 'id', name: "last_modifiy_employe"})
  last_modifiy_employe_id?: string

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ReservationRecord>) {
    super(data);
  }
}

export interface ReservationRecordRelations {
  // describe navigational properties here
}

export type ReservationRecordWithRelations = ReservationRecord & ReservationRecordRelations;
