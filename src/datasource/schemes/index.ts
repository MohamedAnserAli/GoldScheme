import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class Scheme {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      try {
        let { fromDate, toDate, page, schemeId, search, origin } = req.query;
        if (!page) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let userId = req.headers.userid
        let limit = 50;
        page = page * limit - limit;
        let finalResponse = await controller.getSchemesList(
          fromDate,
          toDate,
          limit,
          page,
          userId,
          schemeId,
          search,
          origin
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

    this.router.post("/", async (req, res) => {
      try {
        let {
          name,
          description,
          installmentAmount,
          tenure,
          goldRateType,
          cutOffDays,
        } = req.body;
        if (
          !name &&
          !description &&
          !installmentAmount &&
          !tenure &&
          !goldRateType &&
          !cutOffDays
        ) {
          return res.send({
            status: "failure",
            message: "Missing Necessary Parameter !!!",
          });
        }
        let userId = req.headers.userid
        if (!userId) {
          userId = ""
        }
        goldRateType = 0;
        let finalResponse = await controller.createNewScheme(
          name,
          description,
          installmentAmount,
          tenure,
          goldRateType,
          cutOffDays,
          userId
        );
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!!",
        });
      }
    });

    this.router.put("/", async (req, res) => {
      try {
        let {
          name,
          description,
          installmentAmount,
          tenure,
          goldRateType,
          cutOffDays,
          schemeId,
        } = req.body;
        if (!schemeId) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let updatedUserId = req.headers.userid
        if (!updatedUserId) {
          updatedUserId = ""
        }
        let finalResponse = await controller.updateScheme(
          schemeId,
          name,
          description,
          installmentAmount,
          tenure,
          goldRateType,
          cutOffDays,
          updatedUserId
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
        let { schemeIds } = req.body;
        if (!schemeIds) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let finalResponse = await controller.deleteScheme(schemeIds);
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

export const scheme = new Scheme();
