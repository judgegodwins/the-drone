import * as Yup from "yup";

import { DroneModelType } from "../../database/models/Drone";

export const createDrone = Yup.object().shape({
  model: Yup.string().oneOf([
    DroneModelType.LightWeight,
    DroneModelType.MiddleWeight,
    DroneModelType.CruiserWeight,
    DroneModelType.HeavyWeight,
  ]),
  battery: Yup.number().optional(),
});

export const droneQuery = Yup.object().shape({
  serialNumber: Yup.string().required(),
});

export const createLoad = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z0-9_-]*$/g)
    .required("Should contain letters, numbers, underscore and dashes"),
  weight: Yup.number().required(),
  image: Yup.object({
    name: Yup.string()
  }).required(),
  code: Yup.string()
    .matches(
      /^[A-Z0-9_]*$/g,
      "Should contain uppercase letters, numbers and underscore"
    )
    .optional(),
});
