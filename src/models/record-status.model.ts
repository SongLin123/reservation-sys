import {Entity, model, property} from '@loopback/repository';
export enum RecordStatusEnum {
  APPOINTMENT_IN_PROGRESS = "APPOINTMENT_IN_PROGRESS", // "预约中"
  CANCELED = "CANCELED" // 已取消
}
@model()
export class RecordStatus extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  status_code: string;

  @property({
    type: 'string',
    required: true,
  })
  status_name: string;


  constructor(data?: Partial<RecordStatus>) {
    super(data);
  }
}

export interface RecordStatusRelations {
  // describe navigational properties here
}

export type RecordStatusWithRelations = RecordStatus & RecordStatusRelations;
