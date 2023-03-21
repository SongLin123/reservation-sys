import {authenticate} from '@loopback/authentication';
import {UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {LoggingBindings, logInvocation, WinstonLogger} from '@loopback/logging';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  api,
  get,
  getModelSchemaRef, HttpErrors, param, patch, post, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {RecordStatusEnum, ReservationRecord, TableStatusEnum} from '../../models';
import {NewResvertionRecordRequest} from '../../models/new-resvertion-record-request.model';
import {DateReservationRepository, ReservationRecordRepository, TablesRepository} from '../../repositories';
import {CreateRecordVerificationService} from '../../services';
import {MyUserProfile, MyUserService} from '../../services/user.service';
import {createResponse, ResponseJson, ResponseJsonClass} from "../../utils/create-response";


@api({basePath: "/api"})
export class ResvertionRecordController {
  constructor(

    // Inject a winston logger
    @inject(LoggingBindings.WINSTON_LOGGER)
    private logger: WinstonLogger,

    @repository(ReservationRecordRepository)
    public reservationRecordRepository: ReservationRecordRepository,
    @inject(SecurityBindings.USER, {optional: true})
    public user: MyUserProfile,
    @inject("services.CreateRecordVerificationService")
    private createRecordVerificationService: CreateRecordVerificationService,

    @repository(DateReservationRepository)
    public dateReservationRepository: DateReservationRepository,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,

    @repository(TablesRepository)
    public tablesRepository: TablesRepository,

  ) { }

  @logInvocation()
  @authenticate('isGuest')
  @post('/reservation-records/create')
  @response(200, {
    description: '创建预约',
    content: {
      'application/json': {
        schema: ResponseJson
      }
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema:
            getModelSchemaRef(NewResvertionRecordRequest, {
              title: 'NewReservationRecord',
            }),
        },
      },
    })
    req: NewResvertionRecordRequest,
  ): Promise<ResponseJsonClass<ReservationRecord> | undefined> {

    if (await this.createRecordVerificationService.queryDateDayAndTimeAndTableSizeAvailable(req)) {
      throw new HttpErrors[403](`人位、时间已被选中`);
    }

    if (await this.createRecordVerificationService.queryCurrentGuestHasRescertion(req, this.user.id)) {
      throw new HttpErrors[403](`您在相同时间已经预约过了`);
    }

    const dateRes = await this.dateReservationRepository.findOne({
      where: {
        date_day: req.date_day,
        date_day_time: req.date_day_time,
        table_status: TableStatusEnum.FREE,
        table_id: {
          inq: (await this.tablesRepository.find({
            where: {table_size: req.table_size}
          })).map(i => i.id)
        }
      },
      include: [
        {
          relation: 'tables'
        },
        {relation: 'tableStatus'},
      ]
    })
    if (!dateRes) {
      throw new HttpErrors[404]("当天没有合适的桌子")
    }

    const record = await this.reservationRecordRepository.create({
      guest_user_id: this.user.id,
      date_reservation_id: dateRes!.id
    });
    this.logger.info('create record', record)
    await this.dateReservationRepository.updateById(record.date_reservation_id, {table_status: TableStatusEnum.OCCUPIED})
    this.logger.info('update datereservation', record.date_reservation_id, TableStatusEnum.OCCUPIED)

    const data = await this.reservationRecordRepository.findById(record.id, {
      include: [
        {relation: 'guest_user'},
        {
          relation: 'date_reservation',
          scope: {
            include: [
              {relation: 'tables'},
              {relation: 'tableStatus'},

            ]
          }
        },

      ]
    })

    return createResponse({
      data,
      message: "创建成功"
    })
  }

  // @authenticate('myjwt')
  // @get('/reservation-records/count')
  // @response(200, {
  //   description: 'ReservationRecord model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(ReservationRecord) where?: Where<ReservationRecord>,
  // ): Promise<Count> {
  //   return this.reservationRecordRepository.count(where);
  // }

  @authenticate('myjwt')
  @get('/reservation-records')
  @response(200, {
    description: '查询预约记录',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ReservationRecord, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    // @param.query.string('date_day') date_day?: string,
    @param.query.string('date_day') date_day?: string,
  ): Promise<ResponseJsonClass<ReservationRecord[]>> {


    const user = await this.userService.findUserById(this.user.id)

    const payload: Filter<ReservationRecord> = {
      where: {
        date_reservation_id: {
          inq: (await this.dateReservationRepository.find({
            where: {
              date_day
            }
          })).map(i => i.id)
        }
      },
      include: [
        {relation: "guest_user"},
        {
          relation: "date_reservation",
          scope: {
            include: [
              {
                relation: "tables"
              }
            ]
          }

        },
        {relation: "last_modifiy_employe"}
      ],
      order: ['date_reservation.date_day']
    }
    // 查询当前客人记录
    if (user.is_guest) {
      Object.assign(payload.where!, {guest_user_id: user.id})
    }


    const data = await this.reservationRecordRepository.find(payload)
    return createResponse({data});
  }


  @authenticate('myjwt')
  @get('/reservation-records/{id}')
  @response(200, {
    description: '查询预约记录 by id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ReservationRecord, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ReservationRecord, {exclude: 'where'}) filter?: FilterExcludingWhere<ReservationRecord>
  ): Promise<ReservationRecord> {
    return this.reservationRecordRepository.findById(id, filter);
  }

  @authenticate('myjwt')
  @patch('/reservation-records/update/{id}')
  @response(200, {
    description: '修改预约记录',
    content: {
      'application/json': {
        schema: ResponseJson
      }
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            title: "updateRecord",
            type: "object",
            nullable: false,
            properties: {
              record_status: {
                enum: [RecordStatusEnum.APPOINTMENT_IN_PROGRESS, RecordStatusEnum.CANCELED]
              }
            }
          },
        },
      },
    })
    {record_status}: {record_status: string},
  ): Promise<ResponseJsonClass<ReservationRecord>> {

    const payload = {
      record_status,
    }
    // 非用户修改，记录修改人
    if (!this.user.is_guest) {
      Object.assign(payload, {last_modifiy_employe_id: this.user.id})
    }
    await this.reservationRecordRepository.updateById(id, payload);

    // 修改时间表
    const record = await this.reservationRecordRepository.findById(id);

    switch (record_status) {
      case RecordStatusEnum.CANCELED:
        this.dateReservationRepository.updateById(record.date_reservation_id, {table_status: TableStatusEnum.FREE})

        break;

      default:
        break;
    }

    return createResponse({
      data: await this.reservationRecordRepository.findById(id),
      message: "修改成功"
    })


  }

}
