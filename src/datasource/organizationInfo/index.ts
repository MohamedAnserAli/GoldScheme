import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class OrganizationInfo {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      try {
        let organizationInfo = await controller.getOrganizationInformation()
        return res.send({ status: "success", organizationInfo })
      } catch (error) {
        logger.log("error", error)
        return res.send({ status: "failure", message: "Internal Server Error!!!" })
      }
    });
    this.router.post("/", async (req, res) => {
      try {
        let { name, address } = req.body
        if (!name || !address) {
          return res.send({ status: "failure", message: "Necessary Parameter Missing!!!" })
        }
        let finalResponse = await controller.createOrganizationInformation(name, address)
        return res.send(finalResponse)
      } catch (error) {
        logger.log("error", error)
        return res.send({ status: "failure", message: "Internal Server Error!!!" })
      }
    });
  }

  public getRoute() {
    return this.router;
  }
}

export const organizationInfo = new OrganizationInfo();
