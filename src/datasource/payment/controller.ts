import { environment } from "../../environment/environment";
import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

const Razorpay = require("razorpay");

class Controler {
  razorPayInstance;
  constructor () {
    this.razorPayInstance = new Razorpay({
      key_id: environment.razarPayClient.id,
      key_secret: environment.razarPayClient.key,
    });
  }
  createOrder(transactionId, amount) {
    return new Promise((resolve, reject) => {
      try {
        let order = this.razorPayInstance.orders.create({
          amount: amount * 100,
          currency: "INR",
          receipt: transactionId,
        });
        return resolve(order);
      } catch (error) {
        logger.log("error", error);
        return reject("Error In Create Order Razorpay");
      }
    });
  }

  public createTransactionContoller(
    installmentId,
    schemeEnrollmentId,
    userId,
    amount
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let checkValidInstallmentQuery = queryhelper.checkValidInstallment(
          installmentId,
          schemeEnrollmentId,
          userId
        );
        let checkValidInstallmentResponse = await Utility.databaseQuery(
          checkValidInstallmentQuery,
          "Check Whether InstallmentID Valid or Not"
        );
        if (checkValidInstallmentResponse.length == 0) {
          return resolve({
            status: "failure",
            message: "Mimatch Information Sent",
          });
        }
        let dueAmount = checkValidInstallmentResponse[0]?.dueAmount;
        if (amount < dueAmount) {
          return resolve({
            status: "failure",
            message: "Incorrect DueAmount!!!",
          });
        }
        let createTransactionQeury =
          queryhelper.createTransaction(installmentId);
        let transactionIdResponse = await Utility.databaseQuery(
          createTransactionQeury,
          "Create New Transaction"
        );
        let transactionId = transactionIdResponse.insertId;
        return resolve(transactionId);
      } catch (error) {
        logger.log("error", error);
        return reject("Error In createTransactionContoller method");
      }
    });
  }

  public updateTransactionDetails(orderDetails, transactionId) {
    return new Promise(async (resolve, reject) => {
      try {
        let transactionDetails = JSON.stringify(orderDetails);
        let updateTransactionDetailsQuery =
          queryhelper.updateTransactionDetails(
            transactionDetails,
            transactionId
          );
        await Utility.databaseQuery(
          updateTransactionDetailsQuery,
          "Update Transaction Details"
        );
        return resolve("Update Transaction Success!!!");
      } catch (error) {
        logger.log("error", error);
        return reject("Error In Update Transaction Details");
      }
    });
  }

  public updatePaymentStatus(
    installmentId,
    schemeEnrollmentId,
    userId,
    mode,
    targetUserId
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let checkValidInstallmentQuery = queryhelper.checkValidInstallment(
          installmentId,
          schemeEnrollmentId,
          targetUserId
        );
        let checkValidInstallmentResponse = await Utility.databaseQuery(
          checkValidInstallmentQuery,
          "Check Whether InstallmentID Valid or Not"
        );
        if (checkValidInstallmentResponse.length == 0) {
          return resolve({
            status: "failure",
            message: "Mimatch Information Sent",
          });
        }
        let dueAmount = checkValidInstallmentResponse[0]?.dueAmount;
        let tenure = checkValidInstallmentResponse[0]?.tenure;

        let goldPriceQuery = queryhelper.getCurrentGoldPrice();
        let goldPriceResponse = await Utility.databaseQuery(
          goldPriceQuery,
          "Get Current Gold Price"
        );
        let goldPrice = goldPriceResponse[0]?.price;
        let goldAccumulated = Number(dueAmount) / Number(goldPrice);
        let updateGoldAccm = queryhelper.updateAccRate(
          goldAccumulated,
          installmentId
        );
        await Utility.databaseQuery(updateGoldAccm, "Update Gold Accumulated");
        let updatePaymenQuery = queryhelper.updatePaymentStatus(
          userId,
          mode,
          installmentId
        );
        await Utility.databaseQuery(updatePaymenQuery, "Update payment query");
        let getSchemeIdQuery =
          queryhelper.getSchemeIdUsingEnrollmentId(schemeEnrollmentId);
        let schemeIdResponse = await Utility.databaseQuery(
          getSchemeIdQuery,
          "Get Scheme Id Using Enrollment Id"
        );
        let schemeId = schemeIdResponse[0].schemeId;
        let getGrossAmountForSchemeQuery =
          queryhelper.getGrossAmountForScheme(schemeEnrollmentId);
        let getGrossAmountForSchemeResponse = await Utility.databaseQuery(
          getGrossAmountForSchemeQuery,
          "Get Gross Amount For a Scheme"
        );
        let grossAmount = getGrossAmountForSchemeResponse[0]?.grossAmount;
        let remainingInstallments = getGrossAmountForSchemeResponse[0]?.count;

        let totalGoldAccumulatedQuery =
          queryhelper.getTotalAccmRate(schemeEnrollmentId);
        let totalGoldAccumulatedResponse = await Utility.databaseQuery(
          totalGoldAccumulatedQuery,
          "Total Gold Accumulated"
        );
        let totalGoldAccumulated =
          totalGoldAccumulatedResponse[0].goldAccumulated;
        let updateTotalAccumQuery = queryhelper.updateTotalAccum(
          totalGoldAccumulated,
          schemeEnrollmentId,
          tenure - remainingInstallments
        );
        await Utility.databaseQuery(
          updateTotalAccumQuery,
          "Update Total Accum Gold Query"
        );
        let updateGrossAmountQuery = queryhelper.updateGrossAmount(
          grossAmount,
          schemeId
        );
        await Utility.databaseQuery(
          updateGrossAmountQuery,
          "Update Gross Amount Query"
        );
        return resolve({
          status: "success",
          message: "Payment Info Updated Successfully !!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error Update Payment Status");
      }
    });
  }

  public redeemEnrolledScheme(schemeEnrollmentId) {
    return new Promise(async (resolve, reject) => {
      try {
        let redeemSchemeQuery =
          queryhelper.getRedeemSchemeDetailsQuery(schemeEnrollmentId);
        let redeemSchemeResponse = await Utility.databaseQuery(
          redeemSchemeQuery,
          "Get Redeem Scheme Query"
        );
        let redeemAmount = redeemSchemeResponse[0]?.redeemAmount;
        if (!redeemAmount) {
          return resolve({
            status: "failure",
            message: "Scheme Already Redeemed!!!",
          });
        }
        let createRedeemAmount = queryhelper.insertRedeemInfoQuery(
          schemeEnrollmentId,
          redeemAmount
        );
        await Utility.databaseQuery(createRedeemAmount, "Insert Redeem Query");
        let redeemQuery = queryhelper.redeemSchemeQuery(schemeEnrollmentId);
        await Utility.databaseQuery(redeemQuery, "Update Redeem Query");
        return resolve({
          status: "success",
          message: "Scheme Redeemed Successfully!!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In redeemEnrolledScheme");
      }
    });
  }

  public activateEnrolment(schemeEnrollmentId, activate) {
    return new Promise(async (resolve, reject) => {
      try {
        let activeSchemeEnrolmentQuery = queryhelper.activeScheme(schemeEnrollmentId, activate)
        Utility.databaseQuery(activeSchemeEnrolmentQuery, "Active Scheme Enrolment Query")
        if (activate == "true") {
          return resolve({ status: "success", message: "Enrollment is Activated!!!" })
        } else {
          return resolve({ status: "success", message: "Enrollment is deActivated!!!" })
        }
      } catch (error) {

      }
    })
  }
}

export const controller = new Controler();
