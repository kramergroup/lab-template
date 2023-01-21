
import { users } from "../../data/users.yaml"


export interface ConnectionSetting {
  username: string,
  password: string,
  host: string,
}

export function authenticateUser(username : string, password : string) : boolean {

  const user = users.find((u) => u.username === username)

  if (user === undefined) return false
  if (user.password !== password) return false

  return true
}

export function getConnectionSettings(username : string) : ConnectionSetting | undefined {

  const user = users.find((u) => u.username === username)

  return user
}