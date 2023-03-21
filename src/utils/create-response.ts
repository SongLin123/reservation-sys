import {SchemaObject} from '@loopback/rest';

export class ResponseJsonClass<T> {
  code: number
  data?: T
  message?: string
}

export const ResponseJson: SchemaObject = {
  type: "object",
  title: "Response",
  'x-typescript-type': ResponseJsonClass,
  properties: {

    code: {
      type: "number",
    },
    data: {
      type: "object",
    },
    message: {
      type: "string",

    }
  }
};

export function createResponse<T>({code = 200, data, message = "ok"}: {code?: number, data?: T, message?: string}): ResponseJsonClass<T> {
  return {
    code,
    data,
    message
  }
}
