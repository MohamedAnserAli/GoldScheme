import express from "express";
import { logger } from "../../log/logger";
import { oAuthKey } from "../authorization";
import { controller } from "./controller";
import { provider } from "./provider";
let jwt = require("jsonwebtoken");

class User {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      try {
        let { mobile, fromDate, toDate, userId, search, page, schemaIds, branchIds, userType } =
          req.query;

        if (!page) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        if (mobile?.length < 10) {
          return res.send({
            status: "failure",
            message: "Invalid Mobile Number!!!",
          });
        }
        if (schemaIds) {
          schemaIds = schemaIds.split(",")
        }
        if (branchIds) {
          branchIds = branchIds.split(",")
        }
        if (userType) {
          userType = userType.split(",")
        }
        let limit = 50;
        page = page * limit - limit;
        let finalResponse = await controller.getUsers(
          fromDate,
          toDate,
          limit,
          page,
          userId,
          search,
          userType,
          mobile,
          schemaIds,
          branchIds
        );
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error !!!",
        });
      }
    });
    this.router.post("/", async (req, res) => {
      try {
        let {
          firstName,
          lastName,
          email,
          panNumber,
          mobile,
          address,
          branchId,
          userType,
        } = req.body;
        if (
          !firstName ||
          !lastName ||
          !email ||
          !panNumber ||
          !mobile ||
          !address ||
          !branchId ||
          !userType ||
          typeof mobile != "number"
        ) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing !!!",
          });
        }
        let userId = req.headers.userid
        if (!userId) {
          userId = ""
        }
        let panRegex = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}$")
        if (!panRegex.test(panNumber)) {
          return res.send({ status: "failure", message: "Invalid PAN Number!!!" })
        }
        if (mobile?.toString()?.length < 10) {
          return res.send({
            status: "failure",
            message: "Invalid Mobile Number!!!",
          });
        }
        let checkMobileNumber: any = await controller.checkMobile(mobile);
        if (checkMobileNumber.length > 0) {
          return res.send({
            status: "failure",
            message: "Mobile Number Already Exist!!!",
          });
        }
        let finalResponse = await controller.createNewUser(
          firstName,
          lastName,
          email,
          panNumber,
          mobile,
          address,
          branchId,
          userType,
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
        let {
          firstName,
          lastName,
          email,
          panNumber,
          mobile,
          address,
          branchId,
          userType,
          userId,
        } = req.body;
        if (!userId) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing !!!",
          });
        }
        let updatedUserId = req.headers.userid
        if (!updatedUserId) {
          updatedUserId = ""
        }
        let panRegex = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}$")
        if (!panRegex.test(panNumber) && panNumber) {
          return res.send({ status: "failure", message: "Invalid PAN Number!!!" })
        }
        if (mobile?.toString()?.length < 10) {
          return res.send({
            status: "failure",
            message: "Invalid Mobile Number!!!",
          });
        }
        let finalResponse = await controller.updateUser(
          userId,
          firstName,
          lastName,
          email,
          panNumber,
          mobile,
          address,
          branchId,
          userType,
          updatedUserId
        );
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error",
        });
      }
    });
    this.router.delete("/", async (req, res) => {
      try {
        let { userIds } = req.body;
        let finalResponse = await controller.deleteUser(userIds);
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error",
        });
      }
    });
    this.router.get("/userType", async (req, res) => {
      try {
        let finalResponse = await controller.getUserType();
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.get("/login", async (req, res) => {
      try {
        let { mobile } = req.query;
        if (!mobile) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let checkMobileNumber: any = await controller.checkMobile(mobile);
        if (checkMobileNumber.length == 0) {
          return res.send({
            status: "failure",
            message: "Mobile Number Doen't Exist!!!",
          });
        }
        if (mobile.length < 10) {
          return res.send({
            status: "failure",
            message: "Invalid Mobile Number!!!",
          });
        }
        let token = req.headers.authorization.split(" ")[1];
        var { uuid, hash } = jwt.verify(token, oAuthKey.client_password);
        let userId = checkMobileNumber[0]?.UserId;
        await controller.updateUserIdInoAuth(uuid, hash, userId);
        let sessionId = await provider.callOTPService(mobile);
        let finalResponse = await controller.saveTwoFactorSessionToken(
          sessionId,
          mobile
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
    this.router.get("/verifyOtp", async (req, res) => {
      try {
        let { otp, mobile } = req.query;
        let checkMobileNumber: any = await controller.checkMobile(mobile);
        let userId = checkMobileNumber[0]?.UserId;
        let WebAccess = checkMobileNumber[0]?.WebAccess;
        let MobileAccess = checkMobileNumber[0]?.MobileAccess;
        let sessionId = await controller.getSessionId(mobile);
        let finalResponse: any = await provider.verifyOtpService(
          sessionId,
          otp
        );
        await controller.updateLastLoggin(mobile);
        if (finalResponse.Details == "OTP Matched") {
          return res.send({
            status: "success",
            message: finalResponse.Details,
            userId,
            WebAccess: WebAccess == 0 ? false : true,
            MobileAccess: MobileAccess == 0 ? false : true

          });
        } else {
          return res.send({
            status: "failure",
            message: "Invalid Combination!!!",
          });
        }
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
    this.router.get("/moduleAccess", async (req, res) => {
      try {
        let { userId } = req.query
        if (!userId) {
          return res.send({ status: "failure", message: "Necessary Parameter Missing!!!" })
        }
        let moduleAccess = await controller.moduleAccessController(userId)

        return res.send({ status: "success", moduleAccess })
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

export const user = new User();
