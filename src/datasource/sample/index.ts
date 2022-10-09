import express from "express";

class Sample {
  router;
  constructor() {
    this.router = express.Router();
    this.initialize();
  }

  private initialize() {
    this.router.get("/", async (req, res) => {
      return res.send("Hello");
    });
  }

  public getRoute() {
    return this.router;
  }
}

export const sample = new Sample();
