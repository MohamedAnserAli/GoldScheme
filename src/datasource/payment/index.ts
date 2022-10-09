import express from "express";
import { resolve } from "path";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class Payment {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.post("/createOrder", async (req, res) => {
      try {
        let { installmentId, schemeEnrollmentId, userId, amount } = req.body;
        if (!installmentId || !schemeEnrollmentId || !userId || !amount) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let transactionId = await controller.createTransactionContoller(
          installmentId,
          schemeEnrollmentId,
          userId,
          amount
        );
        if (typeof transactionId == "object") {
          return res.send(transactionId);
        }
        let order = await controller.createOrder(transactionId, amount);
        await controller.updateTransactionDetails(order, transactionId);
        return res.send({ status: "success", order });
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.post("/updateStatus", async (req, res) => {
      try {
        let { installmentId, schemeEnrollmentId, userId, targetUserId, mode } =
          req.body;
        if (
          !installmentId ||
          !schemeEnrollmentId ||
          !userId ||
          !targetUserId ||
          !mode
        ) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let finalResponse = await controller.updatePaymentStatus(
          installmentId,
          schemeEnrollmentId,
          userId,
          mode,
          targetUserId
        );
        let activate = "true"
        await controller.activateEnrolment(schemeEnrollmentId, activate)

        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.post("/webhooks", async (req, res) => {
      let jsonBody = req.body;
      try {
        let paymentDetails = jsonBody?.payload?.payment?.entity;
        await controller.updatePaymentStatus(
          paymentDetails.notes.installmentId,
          paymentDetails.notes.schemeEnrollmentId,
          paymentDetails.notes.userId,
          paymentDetails.notes.mode,
          paymentDetails.notes.targetUserId
        );
        let activate = "true"
        await controller.activateEnrolment(paymentDetails.notes.schemeEnrollmentId, activate)
        return res.send({
          status: "success",
          message: "Payment Info Updated Successfully!!!!",
        });
      } catch (error) {
        logger.log("error", error);
        console.log(JSON.stringify(jsonBody));
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.get("/redeem", async (req, res) => {
      try {
        let { schemeEnrollmentId } = req.query;
        if (!schemeEnrollmentId) {
          return res.send({
            status: "failure",
            message: "Missing Necessary Parameter!!!",
          });
        }
        let finalResponse = await controller.redeemEnrolledScheme(
          schemeEnrollmentId
        );
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

export const payment = new Payment();
