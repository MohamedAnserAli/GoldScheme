import express from "express";
import { AddressInfo } from "net";
import { logger } from "./src/log/logger";
import { dataSource } from "./src/datasource/datasource";
import { oAuth } from "./src/datasource/authorization";
import { controller } from "./src/datasource/ratecard/controller";
import { moduleAccess } from "./src/datasource/moduleAccess";

let dataSourceRoutes = dataSource.getRoute();

let app = express();
let PORT = process.env.PORT || 9120;
let CronJob = require("cron").CronJob;
let cors = require("cors");

app.use(cors());

app.use(oAuth.oAuthverification);
app.use(moduleAccess.verfiyModuleAccess)
app.use(express.json());
app.use("/gss", dataSourceRoutes);

app.get("/healthz", (req, res) => {
  res.json({ code: "0000", status: "Healthy" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.status(404).json({
    code: 404,
    status: "failed",
    message: "Page Not Found",
  });
});

new CronJob(
  "0 0 6 * * *",
  async function () {
    try {
      await controller.insertGoldPrice();
      await controller.updateMissedInstallments();
    } catch (error) {
      logger.log("error", error);
    }
  },
  null,
  true,
  "Asia/Kolkata"
);

let server = app.listen(PORT, function () {
  var { address, port } = server.address() as AddressInfo;
  logger.log("debug", "running at http://" + address + ":" + port);
});
