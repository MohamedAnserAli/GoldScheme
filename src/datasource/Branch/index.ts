import express from "express";
import { logger } from "../../log/logger";
import { controller } from "./controller";

class Branch {
  router;
  constructor () {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      try {
        let { fromDate, toDate, branchId, search } = req.query;
        let finalResponse = await controller.getBranchList(
          fromDate,
          toDate,
          branchId,
          search
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

    this.router.post("/", async (req, res) => {
      try {
        let { name, address, details, associateSchemeIds } = req.body;
        if (!name || !address) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing !!!",
          });
        }
        let finalResponse = await controller.createNewBranch(
          name,
          address,
          details,
          associateSchemeIds
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
        let { branchId, name, address, details, associateSchemeIds } = req.body;
        if (!branchId) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let finalResponse = await controller.updateBranch(
          branchId,
          name,
          address,
          details,
          associateSchemeIds
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
        let { branchIds } = req.body;
        if (!branchIds) {
          return res.send({
            status: "failure",
            message: "Necessary Parameter Missing!!!",
          });
        }
        let finalResponse = await controller.deleteBranch(branchIds);
        return res.send(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return res.send({
          status: "failure",
          message: "Internal Server Error",
        });
      }
    });
  }

  public getRoute() {
    return this.router;
  }
}

export const branch = new Branch();
