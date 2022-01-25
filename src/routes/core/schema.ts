import Joi from "joi";

import { DroneModelType } from "../../database/models/Drone";

export const createDrone = Joi.object({
  model: Joi.string().valid(
    DroneModelType.LightWeight,
    DroneModelType.MiddleWeight,
    DroneModelType.CruiserWeight,
    DroneModelType.HeavyWeight
  ),
  battery: Joi.number().optional(),
});

export const droneQuery = Joi.object({
  serialNumber: Joi.string().required(),
});

export const createLoad = Joi.object({
  name: Joi.string().regex(/^[a-zA-Z0-9_-]*$/g).required(),
  weight: Joi.number().required(),
  image: Joi.any().optional(),
  code: Joi.string().regex(/^[A-Z0-9_]*$/g).optional()
});
