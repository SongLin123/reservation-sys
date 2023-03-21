export interface UserModel {
  id: string

  user_name: string

  is_guest: string
  created: string
  guest_profile?: {
    name:string
    contact_info:string
  }

}
