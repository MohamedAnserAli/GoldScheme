import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class RateCard {
  router;
  constructor() {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.post("/", async (req, res) => {
      try {
        let { goldPrice } = req.body;
        if (!goldPrice) {
          return res.send({
            status: "failure",
            message: "Missing Necessary Parameter!!!",
          });
        }
        let finalResponse = await controller.updateGoldPrice(goldPrice);
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.get("/", async (req, res) => {
      try {
        let finalResponse = await controller.getCurrentGoldPrice();
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "success",
          message: "Internal Server Error!!!",
        });
      }
    });
  }

  public getRoute() {
    return this.router;
  }
}

export const rateCard = new RateCard();
