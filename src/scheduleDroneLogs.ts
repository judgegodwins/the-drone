import schedule from 'node-schedule';
import Logger from './core/Logger';
import { DroneModel } from './database/models/Drone';

schedule.scheduleJob('*/5 * * * *', function() {
  DroneModel.find({}).select({ serialNumber: 1, battery: 1 }).then((data) => {
    Logger.info({[new Date().toLocaleString()]: data});
  }).catch(Logger.error);
})