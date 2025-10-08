import z, { email } from 'zod'

const complaintCategory = ['roads', 'streetlights', 'waste', 'water', 'parks', 'other'];
const userRole = ['admin', 'user'];

export const createUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 charcters"),
    role:z.enum(userRole).default('user'),
    phonenumber:z.string().min(10)
})

export const validateUserSchema = z.object({
    phonenumber: z.string().max(10),
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

