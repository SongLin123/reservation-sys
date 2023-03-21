// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {model, property, repository} from '@loopback/repository';
import {api, get, getModelSchemaRef, param, response} from '@loopback/rest';
import {isEqual, uniq, uniqWith} from 'lodash';
import {TableStatusEnum} from '../../models';
import {DateReservationRepository, TablesRepository} from '../../repositories';
import {createResponse, ResponseJsonClass} from "../../utils/create-response";


@model()
class dateSearchRequest {

  @property({
    type: "string",
    jsonSchema: {
      format: "date"
    }
  })
  date_day: string;

  @property({
    type: "string",
    jsonSchema: {
      enum: ['noon', 'evening']
    }
  })
  date_day_time: string;

}
@api({basePath: "/api"})
export class TablesController {
  constructor(
    @repository(TablesRepository)
    public tablesRepository: TablesRepository,
    @repository(DateReservationRepository)
    public dateReservationRepository: DateReservationRepository,
  ) { }


  @authenticate('myjwt')
  @get('/available-date')
  @response(200, {
    description: '查询桌子可选日',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(dateSearchRequest),
        },
      },
    },
  })
  async availableDateByTableSize(
    @param.query.string('table_size')
    table_size: string,
    @param.query.string('date_day_time')
    date_day_time: string,
  ): Promise<ResponseJsonClass<dateSearchRequest[]>> {
    const dates = (await this.dateReservationRepository.find({
      where: {
        date_day_time: date_day_time,
        table_status: TableStatusEnum.FREE,
        table_id: {
          inq: (await this.tablesRepository.find({
            where: {
              table_size
            }
          })).map(i => i.id)
        }
      },
      order: ['date_day']
    }))

    return createResponse({
      data: uniqWith(dates.map(({date_day, date_day_time}) => ({date_day, date_day_time})), isEqual)

    })
  }


  @authenticate('myjwt')
  @get('/available-table-size')
  @response(200, {
    description: '查询table_size',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'string'
          },
        },
      },
    },
  })
  async availableTableSize(
  ): Promise<ResponseJsonClass<string[]>> {


    return createResponse({
      data: uniq((await this.tablesRepository.find({order: ['table_size']})).map(i => i.table_size))

    })
  }
}
