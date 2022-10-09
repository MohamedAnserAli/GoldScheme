import express from "express";
import moment from "moment";
import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";
const bcrypt = require("bcrypt");
const saltRounds = 10;
export const oAuthKey = {
  client_id: "48F95467E2199770736BC25BB4951EC399748E98596620BD0420A1EBDCD84EE9",
  client_password:
    "$2b$10$mRUztfC4LDFQxheqxta3luRnd/Qzl9pVE/U5rhHb.9Z29knkDDp1m",
};

let jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
class Authorization {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/accessToken", async (req, res) => {
      try {
        bcrypt.hash(
          req.query.client_id,
          saltRounds,
          async function (err, hash) {
            try {
              let uuid = uuidv4();
              let createNewAuthUUID = queryhelper.insertNewAuthUUID(uuid, hash);
              await Utility.databaseQuery(
                createNewAuthUUID,
                "Create New Auth UUID"
              );
              var token = jwt.sign({ uuid, hash }, oAuthKey.client_password, {
                expiresIn: "8h",
              });
              let expiresIn = moment().add(480, "minutes").valueOf();
              return res.send({ access_token: token, expiresIn });
            } catch (error) {
              logger.log("error", error);
              return res.send({
                status: "failure",
                message: "Error In Auth Creation !!!",
              });
            }
          }
        );
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error!!!",
        });
      }
    });
  }
  async oAuthverification(req, res, next) {
    try {
      if (
        req.path == "/gss/oAuth/accessToken" ||
        req.path == "/gss/payment/webhooks"
      ) {
        if (req.query.client_id != oAuthKey.client_id) {
          return res.send({
            status: "failure",
            message: "Invalid Client ID!!!",
          });
        }
        bcrypt.compare(
          req.query.client_id,
          oAuthKey.client_password,
          async (err, result) => {
            if (result) {
              next();
              return;
            } else {
              return res.send({
                status: "failure",
                message: "Invalid Token!!!",
              });
            }
          }
        );
      } else {
        if (!req.headers.authorization) {
          return res.send({ status: "failure", message: "No Auth!!!" });
        }
        let token = req.headers.authorization.split(" ")[1];
        var { uuid, hash } = jwt.verify(token, oAuthKey.client_password);
        bcrypt.compare(oAuthKey.client_id, hash, async (err, result) => {
          try {
            if (result) {
              let checkAuth = queryhelper.checkAuthQuery(uuid, hash);
              let checkAuthResponse = await Utility.databaseQuery(
                checkAuth,
                "Check Auth Query"
              );
              if (checkAuthResponse.length > 0) {
                let fkUserId = checkAuthResponse[0]?.fkUserId;
                let userId = req.headers.userid;
                if (!fkUserId) {
                  if (userId) {
                    return res.send({
                      status: "failure",
                      message: "Invalid Headers!!!",
                    });
                  }
                  if (req.path == "/gss/user/login") {
                    next();
                    return;
                  }
                  if ((req.path == "/gss/user" && req.method == "POST") ||
                    (req.path == "/gss/branch" && req.method == "GET")) {
                    next();
                    return;
                  }
                }

                if (fkUserId == userId && fkUserId) {
                  if (req.path == "/gss/user/login") {
                    return res.send({
                      status: "failure",
                      message: "Not Authorized Path!!!",
                    });
                  }
                  next();
                  return;
                }
                if (req.path == "/gss/user/verifyOtp") {
                  next();
                  return;
                }
                res.send({ status: "failure", message: "Auth Mismatch!!!" });
                return;
              }
              let deactivateAuth = queryhelper.deactivateAuthQuery(uuid, hash);
              await Utility.databaseQuery(
                deactivateAuth,
                "Deactivate Auth Query"
              );
              return res.send({
                status: "failure",
                message: "Auth Expired!!!",
              });
            } else {
              return res.send({
                status: "failure",
                message: "Auth Invalid!!!",
              });
            }
          } catch (error) {
            logger.log("error", error);
            return res.send({
              status: "failure",
              message: "Authorization Invalid!!!",
            });
          }
        });
      }
    } catch (error) {
      logger.log("error", error);
      return res.send({
        status: "failure",
        message: "Authorization Invalid!!!",
      });
    }
  }

  public getRoute() {
    return this.router;
  }
}

export const oAuth = new Authorization();
