import express from "express";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import { unlink } from "fs";
import { promisify } from "util";
import { v2 as cloudinary } from "cloudinary";
import validator, { ValidationSource } from "../../helpers/validator";
import { SuccessResponse } from "../../core/ApiResponse";
import { DroneState, DroneModel } from "../../database/models/Drone";
import Medication, { MedicationModel } from "../../database/models/Medication";
import asyncHandler from "../../helpers/asyncHandler";
import { createDrone, createLoad, droneQuery } from "./schema";
import { BadRequestError, NotFoundError } from "../../core/ApiError";
import upload from "../../helpers/upload";

const router = express.Router();

router.post(
  "/drone/register",
  validator(createDrone, ValidationSource.Body),
  asyncHandler(async (req, res) => {
    if (req.body.state === DroneState.Loading && req.body.battery < 25)
      throw new BadRequestError("Battery is too low to be in loading state");
      
    const drone = await DroneModel.create({ 
      ...req.body,
      serialNumber: uuidv4()
    });

    new SuccessResponse("Drone created", drone.toObject()).send(res);
  })
);

router.patch(
  "/drone/load",
  validator(droneQuery, ValidationSource.Query),
  upload.single("image"),
  validator(createLoad, ValidationSource.Body),
  asyncHandler(async (req, res, next) => {
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

    next();
  }),
  asyncHandler(async (req, res) => {
    var imgUrl: string | undefined;

    if (req.file) {
      const uploadPhoto = async (file: Express.Multer.File) => {
        const details = await cloudinary.uploader.upload(file.path, {
          transformation: [{ quality: "auto" }],
        });
        await promisify(unlink)(file.path);

        return details.secure_url;
      };

      if (!req.file) throw new BadRequestError("No image");

      imgUrl = await uploadPhoto(req.file);
    }

    const medication = await MedicationModel.create({
      ...req.body,
      image: imgUrl,
      code: req.body.code || uuidv4().replace('-', '_').toUpperCase() // replace dash with underscore
    });

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
  validator(droneQuery, ValidationSource.Query),
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
  validator(droneQuery, ValidationSource.Query),
  asyncHandler(async (req, res) => {
    const drone = await DroneModel.findOne({
      serialNumber: req.query.serialNumber as string,
    });

    new SuccessResponse("Battery level", _.pick(drone, ["battery"])).send(res);
  })
);

export default router;
