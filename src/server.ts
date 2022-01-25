import './dotenvConfig';
import './scheduleDroneLogs';
import app from './app';
import Logger from "./core/Logger";
import { port, cloudinaryUrl } from './config';

if (!cloudinaryUrl) {
  Logger.error("Cloudinary url not set in .env");
}

app
  .listen(port, () => {
    Logger.info(`server running on port ${port}`)
  })
  .on("error", (e) => Logger.error(e));