// import {UserCredentials} from '@loopback/authentication-jwt';
import {Entity, hasOne, model, property} from '@loopback/repository';
import {MyUserCredentials} from './my-user-credentials.model';
// import {UserCredentials} from './my-user-credentials.model';

@model()
class GuestProfile {
  @property({
    type: 'string',
    require: true,
    description: '姓名',
  })
  name: string;
  @property({
    type: 'string',
    require: true,
    description: '联系方式',
  })
  contact_info: string;
}

@model({
  settings: {
    strict: false,
  }
})
export class MyUser extends Entity {
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
    description: '用户名',

  })
  user_name: string;

  @property({
    type: 'boolean',
    required: true,
    description: '是否是客人',

  })
  is_guest: boolean;


  @property({
    type: "object",
    required: false,
    jsonSchema: {
      required: ['name', 'contact_info'],
      description: "客人信息"
    },
  })
  guest_profile: GuestProfile;






  @hasOne(() => MyUserCredentials, {keyFrom: 'id', keyTo: 'userId'})
  userCredentials?: MyUserCredentials;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MyUser>) {
    super(data);
  }
}

export interface MyUserRelations {
  // describe navigational properties here
}

export type MyUserWithRelations = MyUser & MyUserRelations;
