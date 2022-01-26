import './dotenvConfig';
import './scheduleDroneLogs';
import app from './app';
import Logger from "./core/Logger";
import { port, cloudinaryUrl } from './config';

if (!cloudinaryUrl) {
  Logger.warn("Cloudinary url not set in .env. Please set it");
}

app
  .listen(port, () => {
    Logger.info(`server running on port ${port}`)
  })
  .on("error", (e) => Logger.error(e));