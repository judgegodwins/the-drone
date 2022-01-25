import express from "express";
import _ from "lodash";
import validator, { ValidationSource } from "../../helpers/validation";
import { SuccessResponse } from "../../core/ApiResponse";
import { DroneState, DroneModel } from "../../database/models/Drone";
import Medication, { MedicationModel } from "../../database/models/Medication";
import asyncHandler from "../../helpers/asyncHandler";
import { createDrone, createLoad, droneQuery } from "./schema";
import { BadRequestError, NotFoundError } from "../../core/ApiError";

const router = express.Router();

router.post(
  "/drone/register",
  // validator(createDrone, ValidationSource.Body),
  asyncHandler(async (req, res) => {
    const drone = await DroneModel.create(req.body);

    new SuccessResponse("Drone created", drone.toObject()).send(res);
  })
);

router.patch(
  "/drone/load",
  // validator(droneQuery, ValidationSource.Query),
  // validator(createLoad, ValidationSource.Body),
  asyncHandler(async (req, res) => {
    const drone = await DroneModel.findOne({
      serialNumber: req.query.serialNumber as string,
    });

    if (!drone) throw new BadRequestError("Drone does not exist");

    const droneIsFree = await DroneModel.isFree(
      drone._id,
      req.body.weight as number
    );
    if (!droneIsFree) throw new BadRequestError("Drone capacity is filled!");

    const medicationCodeExists = await MedicationModel.findOne({
      code: req.body.code,
    });
    if (medicationCodeExists)
      throw new BadRequestError("Medication with code already exists");

    const medication = await MedicationModel.create(req.body);

    const droneUpdate = await DroneModel.findOneAndUpdate(
      { serialNumber: req.query.serialNumber as string },
      { $push: { loads: medication._id } },
      { new: true }
    ).populate<{ loads: Medication[] }>("loads");

    new SuccessResponse("Medication added", droneUpdate?.loads).send(res);
  })
);

router.get(
  "/drone/get-loads",
  // validator(droneQuery, ValidationSource.Query),
  asyncHandler(async (req, res) => {
    const drone = await DroneModel.findOne({
      serialNumber: req.query.serialNumber as string,
    }).populate<{ loads: Medication[] }>("loads");

    if (!drone) throw new NotFoundError("Drone not found!");

    new SuccessResponse("Load on drone", drone.loads).send(res);
  })
);

router.get(
  "/drone/available",
  asyncHandler(async (req, res) => {
    const available = await DroneModel.find({ state: DroneState.Idle });

    new SuccessResponse("Available drones", available).send(res);
  })
);

router.get(
  "/drone/battery-level",
  // validator(droneQuery, ValidationSource.Query),
  asyncHandler(async (req, res) => {
    const drone = await DroneModel.findOne({
      serialNumber: req.query.serialNumber as string,
    });

    new SuccessResponse("Battery level", _.pick(drone, ["battery"])).send(res);
  })
);

export default router;
