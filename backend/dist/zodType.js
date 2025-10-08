"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vadlidateComplainSchema = exports.validateUserSchema = exports.createUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const complaintCategory = ['roads', 'streetlights', 'waste', 'water', 'parks', 'other'];
const userRole = ['admin', 'user'];
exports.createUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(3, "Name must be at least 3 characters"),
    email: zod_1.default.string().optional(),
    password: zod_1.default.string().min(8, "Password must be at least 8 charcters"),
    role: zod_1.default.enum(userRole).default('user'),
    phonenumber: zod_1.default.string().min(10)
});
exports.validateUserSchema = zod_1.default.object({
    phonenumber: zod_1.default.string().max(10),
    password: zod_1.default.string().min(8, "Password must be at least 8 charcters")
});
exports.vadlidateComplainSchema = zod_1.default.object({
    category: zod_1.default.enum(complaintCategory),
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    latitude: zod_1.default.number(),
    longitude: zod_1.default.number(),
    address: zod_1.default.string()
});
