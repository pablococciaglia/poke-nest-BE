import { number, object, required, string } from 'joi';

export const joiValidationSchema = object({
  MONGODB: required(),
  PORT: number().default(3000),
  NODE_ENV: string().default('dev'),
  LIMIT_BY_DEFAULT: number().default(10),
  OFFSET_BY_DEFAULT: number().default(0),
});
