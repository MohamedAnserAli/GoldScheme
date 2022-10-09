import moment from "moment";
import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {
  public insertGoldPrice() {
    return new Promise(async (resolve, reject) => {
      try {
        let getGoldPrice = queryhelper.getYesterdayRateCardPrice();
        let goldPriceResponse = await Utility.databaseQuery(
          getGoldPrice,
          "Get Yesterday's Gold Price"
        );
        let goldPrice = goldPriceResponse[0].price;

        let date = moment(new Date()).tz("UTC").format("YYYY-MM-DD");
        let updateGoldPriceQuery = queryhelper.insertRateCard(
          "gold",
          goldPrice,
          date
        );
        await Utility.databaseQuery(updateGoldPriceQuery, "Update Gold Price");
        logger.log("error", `Gold Price Updated on ${date}`);
        return resolve("Gold Price Updated");
      } catch (error) {
        logger.log("error", error);
        return reject("Error In updating Gold Price");
      }
    });
  }

  public updateGoldPrice(goldPrice) {
    return new Promise(async (resolve, reject) => {
      try {
        let date = moment(new Date()).tz("UTC").format("YYYY-MM-DD");
        let updateGoldPriceQuery = queryhelper.insertRateCard(
          "gold",
          goldPrice,
          date
        );
        await Utility.databaseQuery(updateGoldPriceQuery, "Update Gold Price");
        return resolve({
          status: "success",
          message: "Updated Rate Card Successfully!!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In UpdateGoldPrice Method");
      }
    });
  }

  public getCurrentGoldPrice() {
    return new Promise(async (resolve, reject) => {
      try {
        let getCurrentGoldPriceQuery = queryhelper.getCurrentGoldPrice();
        let getCurrentGoldPriceRsponse = await Utility.databaseQuery(
          getCurrentGoldPriceQuery,
          "Get Current Gold Price"
        );
        if (getCurrentGoldPriceRsponse.length == 0) {
          return resolve({ status: "failure", message: "No Records Found!!!" });
        }
        let goldPrice = getCurrentGoldPriceRsponse[0].price;
        return resolve({ status: "success", todayGoldPrice: goldPrice });
      } catch (error) {
        logger.log("error", error);
        return reject("error in getting gold price");
      }
    });
  }

  public updateMissedInstallments() {
    return new Promise(async (resolve, reject) => {
      try {
        let getInstallmentsDueDateQuery = queryhelper.getInstallmentsDueDate();
        await Utility.databaseQuery(
          getInstallmentsDueDateQuery,
          "Get Insallments Due QUery"
        );
      } catch (error) {
        logger.log("error", error);
        return resolve("Err in Updating Missed Installments");
      }
    });
  }
}
export const controller = new Controler();
