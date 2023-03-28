// Uncomment these imports to begin using these cool features!

import {field, inputType, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';
import {GuestProfile, MyUser} from '.';

@objectType({implements: MyUser})
@inputType()
@model()
export class NewUserRequest extends MyUser {
  @field({nullable: false})
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8
    }
  })
  password: string;

  @field(type => String)
  user_name: string;

  @field(type => Boolean)
  is_guest: boolean;

  @field(type => GuestProfile, {
    nullable: true
  })
  guest_profile: GuestProfile;
}
