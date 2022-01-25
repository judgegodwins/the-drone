import Joi from "joi";
import { isValidObjectId, Types } from "mongoose";

export const isObjectId = Joi.custom((value: string, helpers) => {
  if (!isValidObjectId(value)) return helpers.error("any.invalid");

  return value;
});

/**
 * This returns an object schema that includes all args. All args are to be validated as valid ObjectIds
 * @param args fields that should be validated
 * @returns an object schema of the fields.
 */
export const validIdParams = (...args: string[]) => {
  const schema = args.reduce<{ [key: string]: Joi.AnySchema }>((acc, arg) => {
    acc[arg] = isObjectId.required();

    return acc;
  }, {});

  return Joi.object(schema);
};

export const paginationQuery = Joi.object({
  page: Joi.number(),
  limit: Joi.number(),
});

export const paginationQueryRequired = paginationQuery.options({
  presence: "required",
});

export const sortQuery = Joi.object({
  orderBy: Joi.string(),
  order: Joi.string().valid('asc', 'desc', 'ascending', 'descending'),
});
