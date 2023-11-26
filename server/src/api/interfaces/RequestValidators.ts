import { AnyZodObject } from "zod";

export default interface RequestValidators {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}
