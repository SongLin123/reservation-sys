import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  api,
  get,
  getModelSchemaRef, response
} from '@loopback/rest';
import {TableStatus} from '../../models';
import {TableStatusRepository} from '../../repositories';
@api({basePath: "/api"})
export class TableStatusController {
  constructor(
    @repository(TableStatusRepository)
    public tableStatusRepository: TableStatusRepository,
  ) { }

  @authenticate('myjwt')
  @get('/table-statuses')
  @response(200, {
    description: '桌子状态',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TableStatus, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<TableStatus[]> {
    return this.tableStatusRepository.find();
  }

}
