import type { LiteralUnion } from 'type-fest'

export interface DateType {
  monthDay: LiteralUnion<number, ''>
  day: number
  month: number
  year: number
}
