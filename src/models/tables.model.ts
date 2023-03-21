import {Entity, model, property} from '@loopback/repository';

@model()
export class Tables extends Entity {
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
  })
  table_size: string;

  @property({
    type: 'string',
    required: true,
  })
  table_num: string;


  constructor(data?: Partial<Tables>) {
    super(data);
  }
}

export interface TablesRelations {
  // describe navigational properties here
}

export type TablesWithRelations = Tables & TablesRelations;
