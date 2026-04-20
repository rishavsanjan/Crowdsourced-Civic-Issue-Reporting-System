export interface Badge {
  created_at: string,
  criteria: string,
  description: string,
  icon_url: string,
  name: string,
  updated_at: string,
  current: number,
  goal: number,
  id: number

  awarded_at: Date
  badge_id: number
  user_id: number,
  badge: {
    description: string
    name: string
    icon_url: string
  }
}