import dayjs from "dayjs";
import {v4 as uuidv4} from 'uuid';
import {DbDataSource} from './datasources/db.datasource';
import {DateReservation, RecordStatus, RecordStatusEnum, Tables, TableStatus, TableStatusEnum} from './models';
import {DateReservationRepository, RecordStatusRepository, TablesRepository, TableStatusRepository} from './repositories';

const drop = true; // 是否删除数据
export async function initDB(ds: DbDataSource) {
  await initTables(ds);
  await initTableStatus(ds);
  await initRecordStatus(ds);
  await initDateResvertion(ds);

}

// 日期预定表
async function initDateResvertion(ds: DbDataSource) {

  // 查询桌子数据
  const tableRepository = new TablesRepository(ds);
  const allTables = await tableRepository.find();

  const repository = new DateReservationRepository(ds);
  const count = await repository.count()

  if (count.count === 365 * 2 * allTables.length && !drop) {
    return
  }


  // 删除所有现有数据x
  await repository.deleteAll()

  // // 生成包含今年所有日的数组
  const startOfYear = dayjs().startOf('year');

  const daysOfYear = [...Array(365)]
    .map((_, offset) => startOfYear.add(offset, "day").format("YYYY-MM-DD"))
    .map(day => ([{date_day: day, date_day_time: "noon"}, {date_day: day, date_day_time: "evening"}]))
    .flat()
    .map(({date_day, date_day_time}) => {
      return allTables.map(({id}) => ({
        date_day,
        date_day_time,
        table_id: id,
        table_status: TableStatusEnum.FREE
      }))
    })
    .flat()

  // 插入新数据
  await repository.createAll(
    createList(DateReservation, daysOfYear)
  )
}

// 桌子状态
async function initTableStatus(ds: DbDataSource) {

  const source = [
    {status_code: TableStatusEnum.OCCUPIED, status_name: '已占用'},
    {status_code: TableStatusEnum.FREE, status_name: '空闲'},
  ]

  const repository = new TableStatusRepository(ds);

  const count = await repository.count()

  if (count.count === source.length && !drop) {
    return
  }

  await repository.deleteAll()

  await repository.createAll(
    createList(TableStatus, source)
  )
}
// 预约状态
async function initRecordStatus(ds: DbDataSource) {
  const source = [
    {status_code: RecordStatusEnum.APPOINTMENT_IN_PROGRESS, status_name: '预约中'},
    {status_code: RecordStatusEnum.CANCELED, status_name: '已取消'},
  ]
  const repository = new RecordStatusRepository(ds);
  const count = await repository.count()

  if (count.count === source.length && !drop) {
    return
  }
  await repository.deleteAll()

  await repository.createAll(
    createList(RecordStatus, source)
  )
}
// 桌子
async function initTables(ds: DbDataSource) {

  const source = [
    {id: uuidv4(), table_size: "2", table_num: "1"},
    {id: uuidv4(), table_size: "2", table_num: "2"},
    {id: uuidv4(), table_size: "2", table_num: "3"},
    {id: uuidv4(), table_size: "2", table_num: "4"},
    {id: uuidv4(), table_size: "4", table_num: "5"},
    {id: uuidv4(), table_size: "4", table_num: "6"},
    {id: uuidv4(), table_size: "4", table_num: "7"},
    {id: uuidv4(), table_size: "4", table_num: "8"},
    {id: uuidv4(), table_size: "6", table_num: "9"},
  ]
  const repository = new TablesRepository(ds);

  const count = await repository.count()

  if (count.count === source.length && !drop) {
    return
  }

  await repository.deleteAll()

  await repository.createAll(
    createList(Tables, source)
  )

}

function createList(construc: any, datas: any[]) {
  return datas.map(d => {
    return new construc(d);
  })
}




