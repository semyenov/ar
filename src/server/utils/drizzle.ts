import { drizzle } from 'drizzle-orm/postgres-js'

let drizzleInstance: null | ReturnType<typeof drizzle> = null

export function useDrizzle() {
  drizzleInstance ??= drizzle({
    casing: 'snake_case',
    connection: { url: useRuntimeConfig().dbUrl },
  })

  return drizzleInstance
}
