import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class Dashboard {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/newcustomer", async (req, res) => {
      try {
        let finalResponse = await controller.getNewCustomerCount();
        return res.send({ status: "success", data: finalResponse });
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal server Error!!!",
        });
      }
    });
    this.router.get("/totalamount", async (req, res) => {
      try {
        let finalResponse = await controller.getMonthlyPaidAmountPerScheme();
        return res.send({
          status: "success",
          data: finalResponse,
        });
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error !!!",
        });
      }
    });
    this.router.get("/topPerformingBranch", async (req, res) => {
      try {
        let finalResponse =
          await controller.totalTopPerformingBranch();
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!s",
        });
      }
    });
    this.router.get("/topPerformingScheme", async (req, res) => {
      try {
        let finalResponse =
          await controller.totalTopPerformingScheme();
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.get("/missedInstallments", async (req, res) => {
      try {
        let finalResponse = await controller.totalMissedInstallments();
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error !!!",
        });
      }
    });
    this.router.get("/notRedeemedYet", async (req, res) => {
      try {
        let finalResponse = await controller.redeemPerMonth();
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error !!!",
        });
      }
    });
    this.router.get("/expectedRedeemAmount", async (req, res) => {
      try {
        let finalResponse = await controller.expectedRedeemAmount();
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error !!!",
        });
      }
    });
    this.router.get("/getRedeemedUsers", async (req, res) => {
      try {
        let finalResponse = await controller.getRedeemedUserPerMonth();
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error !!!",
        });
      }
    });
  }

  public getRoute() {
    return this.router;
  }
}

export const dashboard = new Dashboard();
