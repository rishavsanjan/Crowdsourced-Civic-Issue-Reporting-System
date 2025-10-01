import z, { email } from 'zod'

const complaintCategory = ['roads', 'streetlights', 'waste', 'water', 'parks', 'other']

export const createUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 charcters")
})

export const validateUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 charcters")
})

export const vadlidateComplainSchema = z.object({
    category:z.enum(complaintCategory),
    title: z.string(),
    description: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    address: z.string()
})

