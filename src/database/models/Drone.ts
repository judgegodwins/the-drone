import { Document, Schema, Types, model, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import Medication, { DOCUMENT_NAME as MED_DOC_NAME } from "./Medication";

export const DOCUMENT_NAME = "Drone";
export const COLLECTION_NAME = "drones";

export enum DroneModelType {
  LightWeight = "LightWeight",
  MiddleWeight = "MiddleWeight",
  CruiserWeight = "CruiserWeight",
  HeavyWeight = "HeavyWeight",
}

export enum DroneState {
  Idle = "IDLE",
  Loading = "LOADING",
  Loaded = "LOADED",
  Delivering = "DELIVERING",
  Delivered = "DELIVERED",
  Returning = "RETURNING",
}

enum WeightLimit {
  LightWeight = 200,
  MiddleWeight = 300,
  CruiserWeight = 400,
  HeavyWeight = 500,
}

export default interface Drone {
  serialNumber: string;
  model: DroneModelType;
  weightLimit: WeightLimit;
  battery: number;
  state: string;
  loads: Types.ObjectId[];
}

export interface DroneModel extends Model<Drone> {
  isFree(id: Types.ObjectId, weight: number): Promise<boolean>;
}

const schema = new Schema<Drone>({
  serialNumber: {
    type: Schema.Types.String,
    required: true,
    maxlength: 100,
  },
  model: {
    type: Schema.Types.String,
    required: true,
    enum: [
      DroneModelType.LightWeight,
      DroneModelType.MiddleWeight,
      DroneModelType.CruiserWeight,
      DroneModelType.HeavyWeight,
    ],
  },
  weightLimit: {
    type: Schema.Types.Number,
    enum: [
      WeightLimit.LightWeight,
      WeightLimit.MiddleWeight,
      WeightLimit.CruiserWeight,
      WeightLimit.HeavyWeight,
    ],
    max: 500,
  },
  battery: {
    type: Schema.Types.Number,
    required: true,
    min: 0,
    max: 100,
    default: 100,
  },
  state: {
    type: Schema.Types.String,
    required: true,
    enum: [
      DroneState.Idle,
      DroneState.Loading,
      DroneState.Loaded,
      DroneState.Delivering,
      DroneState.Delivered,
      DroneState.Returning,
    ],
    default: DroneState.Idle,
  },
  loads: [{ type: Schema.Types.ObjectId, ref: MED_DOC_NAME }],
});

function selectWeightLimit(doc: Document<any, any, Drone> & Drone) {
  switch (doc.model) {
    case DroneModelType.LightWeight:
      return 200;
    case DroneModelType.MiddleWeight:
      return 300;
    case DroneModelType.CruiserWeight:
      return 400;
    case DroneModelType.HeavyWeight:
      return 500;
    default:
      return 200;
  }
}

schema.pre("save", function (this: Document<any, any, Drone> & Drone, next) {
  console.log("saving");
  this.weightLimit = selectWeightLimit(this);

  next();
});

schema.statics.isFree = async function (id, weight) {
  const drone = await DroneModel.findById(id).populate<{ loads: Medication[] }>(
    "loads",
    "weight"
  );

  if (!drone) throw new Error("Drone not found");

  if (drone.loads.length <= 0) return true;
  // Get total size of loads currently on the drone
  const currentLoad = drone.loads
    .map((load: Medication) => load.weight)
    .reduce((prev, current) => prev + current);

  return drone.weightLimit - currentLoad >= weight;
};

export const DroneModel = model<Drone, DroneModel>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
