import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>



export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  inn: z.string(),
  kpp: z.string(),
  district: z.string(),
  address: z.string(),
  status: z.string(),
})

export type Organization = z.infer<typeof organizationSchema>




export const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email:z.string(),
  phone: z.string(),
  status: z.enum(["active", "blocked", "default"]),
  // role: z.enum(["root", "operator OIV/OMSU", "operator KMP", "editor"])
})

export type User = z.infer<typeof UserSchema>