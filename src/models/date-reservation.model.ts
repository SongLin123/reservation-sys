import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TableStatus} from './table-status.model';
import {Tables} from './tables.model';

@model()
export class DateReservation extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    description: '预定日',
    jsonSchema: {
      format: "date"
    }
  })
  date_day: string;

  @property({
    type: 'string',
    required: true,
    description: '预定用餐时间',
    jsonSchema: {
      enum: ['noon', 'evening']
    }
  })
  date_day_time: string;

  @belongsTo(() => Tables, {keyTo: "id", name: "tables"})
  table_id: string;

  @belongsTo(() => TableStatus, {keyTo: "status_code", name: "tableStatus"})
  table_status: string;


  constructor(data?: Partial<DateReservation>) {
    super(data);
  }
}

export interface DateReservationRelations {
  // describe navigational properties here

}

export type DateReservationWithRelations = DateReservation & DateReservationRelations;
