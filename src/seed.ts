import { v4 as uuidv4 } from 'uuid';
import { DroneModel } from "./database/models/Drone";
import { DroneModelType } from "./database/models/Drone";
import Logger from './core/Logger';

DroneModel.find({}).then(async (data) => {
  if (data.length <= 0) await seed();
}).catch(Logger.error);

async function seed() {
  for (let i = 0; i < 10; i++) {
    const index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;

    const mods = [
      DroneModelType.LightWeight,
      DroneModelType.MiddleWeight,
      DroneModelType.CruiserWeight,
      DroneModelType.HeavyWeight,
    ];

    await DroneModel.create({
      serialNumber: uuidv4(),
      model: mods[index]
    });
  }
}
