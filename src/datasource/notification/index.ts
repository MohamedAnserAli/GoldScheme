import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class NotificationConfig {
  router;
  constructor() {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      try {
        let { fromDate, toDate, type, search, notificationConfigId } =
          req.query;

        let finalResponse = await controller.getNotificationConfigList(
          fromDate,
          toDate,
          type,
          search,
          notificationConfigId
        );
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Interval Server Error!!!",
        });
      }
    });
    this.router.post("/", async (req, res) => {
      try {
        let { type, title, message, publishedDate, userId } = req.body;
        if (!type || !title || !message || !publishedDate || !userId) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let finalResponse = await controller.createNewNotificationConfig(
          type,
          title,
          message,
          publishedDate,
          userId
        );
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.put("/", async (req, res) => {
      try {
        let { NotifiSmsConfigId, type, title, message, publishedDate, userId } =
          req.body;
        if (!NotifiSmsConfigId || !userId) {
          return res.send({
            status: "failure",
            message: "Missing Necessary Parameter!!!",
          });
        }
        let finalResponse = await controller.updateNotificationConfig(
          NotifiSmsConfigId,
          type,
          title,
          message,
          publishedDate,
          userId
        );
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.delete("/", async (req, res) => {
      try {
        let { notificationConfigIds, userId } = req.body;
        if (!notificationConfigIds || !userId) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let finalResponse = await controller.deleteNotificationConfig(
          notificationConfigIds,
          userId
        );
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
  }

  public getRoute() {
    return this.router;
  }
}

export const notificationConfig = new NotificationConfig();
