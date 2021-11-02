import { TEmployee } from "./t-employee"
import { TAttachment } from "./t-attachment"

export class HApplicantEdit {
  id: number
  name: string
  nik: string
  join_date: Date
  employee: TEmployee
  attachment: TAttachment
}
