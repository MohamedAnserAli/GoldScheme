import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class Offers {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      try {
        let { offerId } = req.query
        let finalResponse = await controller.getAllOffer(offerId)
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error)
        return res.send({ status: "failure", message: "Internal Server Error!!!" })
      }
    });

    this.router.post("/", async (req, res) => {
      try {
        let { name, description, offerAmount, knowMore } = req.body
        if (!name || !description || !offerAmount || !knowMore) {
          return res.send({ status: "failure", message: "Missing Necessary Parameter!!!" })
        }
        let finalResponse = await controller.addSingleOffer(name, description, offerAmount, knowMore)
        return res.send(finalResponse)
      } catch (error) {
        logger.log("error", error)
        return res.send({ status: "failure", message: "Internal Server Error!!!" })
      }
    })

    this.router.put("/", async (req, res) => {
      try {
        let { offerId, name, description, offerAmount, knowMore } = req.body
        if (!offerId) {
          return res.send({ status: "failure", message: "Missing Necessary Parameter!!!" })
        }
        let finalResponse = await controller.updateSingleOffer(offerId, name, description, offerAmount, knowMore)
        return res.send(finalResponse)
      } catch (error) {
        logger.log("error", error)
        return res.send({ status: "failure", message: "Internal Server Error!!!" })
      }
    })

    this.router.delete("/", async (req, res) => {
      try {
        let { offerIds } = req.body
        if (!offerIds) {
          return res.send({ status: "failure", message: "Missing Necessary Parameter!!!" })
        }
        let finalResponse = await controller.deleteOffers(offerIds)
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

export const offers = new Offers();
