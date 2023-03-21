import {Entity, model, property} from '@loopback/repository';
export enum TableStatusEnum {
  OCCUPIED = "OCCUPIED", // "已占用"
  FREE = "FREE" // 空闲
}
@model()
export class TableStatus extends Entity {
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


  constructor(data?: Partial<TableStatus>) {
    super(data);
  }
}

export interface TableStatusRelations {
  // describe navigational properties here
}

export type TableStatusWithRelations = TableStatus & TableStatusRelations;
