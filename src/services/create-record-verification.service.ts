import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {RecordStatusEnum, TableStatusEnum} from '../models';
import {NewResvertionRecordRequest} from '../models/new-resvertion-record-request.model';
import {DateReservationRepository, ReservationRecordRepository, TablesRepository, TableStatusRepository} from '../repositories';

@injectable()
export class CreateRecordVerificationService {
  constructor(
    @repository(DateReservationRepository)
    public dateReservationRepository: DateReservationRepository,

    @repository(ReservationRecordRepository)
    public reservationRecordRepository: ReservationRecordRepository,

    @repository(TablesRepository)
    public tablesRepository: TablesRepository,

    @repository(TableStatusRepository)
    public tableStatusRepository: TableStatusRepository,
  ) { }
  // 判断输入人位、日期、时间段是否可用

  async queryDateDayAndTimeAndTableSizeAvailable(req: NewResvertionRecordRequest): Promise<boolean> {

    const avaTableSize = await this.tablesRepository.find({
      where: {
        table_size: req.table_size
      }
    })
    if (avaTableSize.length == 0) {
      throw new HttpErrors[406]("没有您选择的桌子类型")
    }
    const avaTable = await this.dateReservationRepository.find({
      where: {
        date_day: req.date_day,
        date_day_time: req.date_day_time,
        and: [
          {
            table_id: {
              inq: await (await this.tablesRepository.find({where: {table_size: req.table_size}})).map(i => i.id)
            }
          },
          {
            table_status: TableStatusEnum.FREE
          }
        ]

      },
      include: [
        {
          relation: 'tables'
        },
        {
          relation: 'tableStatus'
        },
      ]
    })


    return avaTable.length == 0
  }


  // 查询当前用户当天当时段是否已经有预约
  async queryCurrentGuestHasRescertion(req: NewResvertionRecordRequest, userid: string): Promise<boolean> {

    const userRess = await this.reservationRecordRepository.find({
      where: {
        record_status: RecordStatusEnum.APPOINTMENT_IN_PROGRESS,

        guest_user_id: userid,

        date_reservation_id: {
          inq: (await this.dateReservationRepository.find({
            where: {
              date_day: req.date_day,
              date_day_time: req.date_day_time,
            }
          })).map(i => i.id)
        }


      }
    })
    return userRess.length > 0
  }
}
