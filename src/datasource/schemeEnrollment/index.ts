import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class SchemeEnrollment {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      try {
        let { userId } = req.query;
        if (!userId) {
          return res.send({
            status: "success",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let finalResponse = await controller.getEnrolledSchemeList(userId);
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });

    this.router.post("/", async (req, res) => {
      try {
        let { userId, schemeId } = req.body;
        if (!userId || !schemeId) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let finalResponse = await controller.EnrollNewScheme(userId, schemeId);
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
        let { userId, schemeId, activate } = req.body
        if (!userId || !schemeId || !activate) {
          return res.send({ status: "failure", message: "Missing Necessary Parameter!!!" })
        }
        let finalResponse = await controller.activateEnrolment(userId, schemeId, activate)
        return res.send(finalResponse)
      } catch (error) {
        logger.log("error", error)
        return res.send({ status: "failure", message: "Internal Server Error!!!" })
      }
    })
  }

  public getRoute() {
    return this.router;
  }
}

export const schemeEnrollment = new SchemeEnrollment();
