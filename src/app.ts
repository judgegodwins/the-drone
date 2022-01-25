import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import Logger from "./core/Logger";
import { corsUrl, environment } from "./config";
import "./database";
import './seed';
import { ApiError, InternalError, NotFoundError } from "./core/ApiError";
import routes from "./routes/core";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({ extended: true, limit: "10mb", parameterLimit: 50000 })
);

app.use("/", routes);

app.use((req, res, next) => next(new NotFoundError()));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment == "development") {
      return res.status(500).send(err.message);
    }
    Logger.error(err);
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
