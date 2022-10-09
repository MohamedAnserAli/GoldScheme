import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class ModuleAccess {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      return res.send("Hello");
    });
  }

  public async verfiyModuleAccess(req, res, next) {
    try {
      let userId = req.headers.userid
      let apiPath = req.path.split("/")[2]
      let reqMethod = req.method.toLowerCase()
      if (req.path == "/gss/user/moduleAccess" ||
        req.path == "/gss/user/login" ||
        req.path == "/gss/oAuth/accessToken" ||
        req.path == "/gss/user/verifyOtp" ||
        (req.path == "/gss/payment/webhooks" && reqMethod == "post") ||
        (req.path == "/gss/user" && reqMethod == "post") ||
        (req.path == "/gss/branch" && reqMethod == "get")) {
        return next()
      }
      let moduleAccess: any = await controller.getModuleAccessForSingleUserId(userId, apiPath)
      if (reqMethod == "get" && moduleAccess.ReadMode) {
        next()
        return
      }
      if (reqMethod == "put" && moduleAccess.EditMode) {
        next()
        return
      }
      if (reqMethod == "post" && moduleAccess.CreateMode) {
        next()
        return
      }
      if (reqMethod == "delete" && moduleAccess.DeleteMode) {
        next()
        return
      }
      return res.send({ status: "failure", message: "API Access Denied!!!" })
    } catch (error) {
      logger.log("error", error)
      return res.send({ status: "failure", message: "API Access Denied!!!" })
    }

  }



  public getRoute() {
    return this.router;
  }
}

export const moduleAccess = new ModuleAccess();
