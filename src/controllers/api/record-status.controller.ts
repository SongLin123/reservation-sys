import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  api,
  get,
  getModelSchemaRef, response
} from '@loopback/rest';
import {RecordStatus} from '../../models';
import {RecordStatusRepository} from '../../repositories';

@api({basePath: "/api"})
export class RecordStatusController {
  constructor(
    @repository(RecordStatusRepository)
    public recordStatusRepository: RecordStatusRepository,
  ) { }


  @authenticate('myjwt')
  @get('/record-statuses')
  @response(200, {
    description: '记录状态',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RecordStatus, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<RecordStatus[]> {
    return this.recordStatusRepository.find();
  }

}
