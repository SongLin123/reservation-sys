// Uncomment these imports to begin using these cool features!

import {model, property} from '@loopback/repository';

// import {inject} from '@loopback/core';
@model()
export class NewResvertionRecordRequest {
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

  @property({
    type: 'string',
    required: true,
  })
  table_size: string;
}
