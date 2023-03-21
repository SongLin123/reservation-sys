// Uncomment these imports to begin using these cool features!

import {model, property} from '@loopback/repository';
import {MyUser} from '.';

// import {inject} from '@loopback/core';

@model()
export class NewUserRequest extends MyUser {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8
    }
  })
  password: string;
}
