export interface Pager {
  total: number
  size: number
  currentPage: number
  totalPage: number
  hasPrevPage: boolean
  hasNextPage: boolean
}
export interface PaginateResult<T> {
  data: T[]
  pagination: Pager
}

export interface GuestProfile {
  name: string;
  contact_info: string;
}

export interface UserCredentials {
  password: string;
  userId: string;
  id: string;
}

export interface GuestUser {
  user_name: string;
  is_guest: string;
  id: string;
  guest_profile: GuestProfile;
  userCredentials: UserCredentials;
  state: 'disable'|'enable';
}

export interface Tables {
  table_size: string;
  table_num: string;
  id: string;
}

export interface TableStatus {
  status_code: string;
  status_name: string;
}

export interface DateReservation {
  date_day: string;
  date_day_time: string;
  id: string;
  table_id: string;
  table_status: string;
  tables: Tables;
  tableStatus: TableStatus;
}


export interface UserCredentials {
  password: string;
  userId: string;
  id: string;
}

export interface LastModifiyEmploye {
  user_name: string;
  is_guest: string;
  id: string;
  guest_profile: GuestProfile;
  userCredentials: UserCredentials;
}

export interface ResvertionRecord {
  create_time: string;
  last_update_time: string;
  id: string;
  record_status: string;
  guest_user_id: string;
  date_reservation_id: string;
  last_modifiy_employe_id: string;
  guest_user: GuestUser;
  date_reservation: DateReservation;
  last_modifiy_employe: LastModifiyEmploye;
}[]

export enum TableStatusEnum {
  OCCUPIED = "OCCUPIED", // "已占用"
  FREE = "FREE" // 空闲
}
export enum RecordStatusEnum {
  APPOINTMENT_IN_PROGRESS = "APPOINTMENT_IN_PROGRESS", // "预约中"
  CANCELED = "CANCELED" // 已取消
}
