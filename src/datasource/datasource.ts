import express from "express";
import { user } from "./user";
import { scheme } from "./schemes";
import { branch } from "./Branch";
import { oAuth } from "./authorization";
import { schemeEnrollment } from "./schemeEnrollment";
import { payment } from "./payment";
import { rateCard } from "./ratecard";
import { dashboard } from "./dashboard";
import { notificationConfig } from "./notification";
import { offers } from "./offers";
import { organizationInfo } from "./organizationInfo";
class DataSource {
  dataSourceRouter;
  constructor () {
    this.dataSourceRouter = express.Router();
    this.initialize();
  }

  initialize() {
    this.dataSourceRouter.use("/user", user.getRoute());
    this.dataSourceRouter.use("/scheme", scheme.getRoute());
    this.dataSourceRouter.use("/branch", branch.getRoute());
    this.dataSourceRouter.use("/schemeEnrollment", schemeEnrollment.getRoute());
    this.dataSourceRouter.use("/payment", payment.getRoute());
    this.dataSourceRouter.use("/oAuth", oAuth.getRoute());
    this.dataSourceRouter.use("/rateCard", rateCard.getRoute());
    this.dataSourceRouter.use("/dashboard", dashboard.getRoute());
    this.dataSourceRouter.use("/offers", offers.getRoute())
    this.dataSourceRouter.use("/organizationInfo", organizationInfo.getRoute())
    this.dataSourceRouter.use(
      "/notificationConfig",
      notificationConfig.getRoute()
    );
  }

  public getRoute() {
    return this.dataSourceRouter;
  }
}

export const dataSource = new DataSource();
