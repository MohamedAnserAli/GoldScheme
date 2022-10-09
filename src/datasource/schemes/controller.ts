import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {
  public createNewScheme(
    name,
    description,
    installmentAmount,
    tenure,
    goldRateType,
    cutOffDays,
    userId
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let insertNewSchemeQuery = queryhelper.insertNewScheme(
          name,
          description,
          installmentAmount,
          tenure,
          goldRateType,
          cutOffDays,
          userId
        );
        await Utility.databaseQuery(insertNewSchemeQuery, "Create New Scheme");
        return resolve({ status: "success", message: "New Scheme Created!!!" });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In Create New Scheme");
      }
    });
  }

  public getSchemesList(fromDate, toDate, limit, page, userId?, schemeId?, search?, origin?) {
    return new Promise(async (resolve, reject) => {
      try {

        let getSchemeEnrollMentIdsQuery = queryhelper.getSchemeEnrolledIds(userId)
        let schemeEnrollmentIds = await Utility.databaseQuery(getSchemeEnrollMentIdsQuery, "Get Scheme Enroll MentIds Query")
        let getSchemeListQuery = queryhelper.getSchemeList(
          fromDate,
          toDate,
          limit,
          page,
          schemeEnrollmentIds,
          userId,
          schemeId,
          search,
          origin
        );
        let schemeListWithCount = await Utility.databaseQuery(
          getSchemeListQuery,
          "Get Scheme List Query"
        );
        let schemeList = schemeListWithCount[0];
        let totalCount = schemeListWithCount[1][0]?.Count;
        return resolve({ status: "success", schemeList, totalCount });
      } catch (error) {
        logger.log("error", JSON.stringify(error));
        return reject("Error In getSchemeList method");
      }
    });
  }

  public updateScheme(
    schemeId,
    name,
    description,
    installmentAmount,
    tenure,
    goldRateType,
    cutOffDays,
    updatedUserId
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateschemeQuery = queryhelper.updateScheme(
          schemeId,
          name,
          description,
          installmentAmount,
          tenure,
          goldRateType,
          cutOffDays,
          updatedUserId
        );
        await Utility.databaseQuery(updateschemeQuery, "Update Scheme Query");
        return resolve({
          status: "success",
          message: "Scheme Updated Successfully !!!",
        });
      } catch (error) {
        logger.log("error", JSON.stringify(error));
        return reject("Error In Update Scheme Method");
      }
    });
  }

  public deleteScheme(schemeIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let deleteSchemeQuery = "";
        schemeIds.map((schemeId) => {
          deleteSchemeQuery += queryhelper.deleteScheme(schemeId);
        });
        await Utility.databaseQuery(deleteSchemeQuery, "Delete Scheme Query");
        return resolve({
          status: "Success",
          message: "Deleted Scheme Successfully!!!",
        });
      } catch (error) {
        logger.log("error", JSON.stringify(error));
        return reject("Error in Delete Scheme Method");
      }
    });
  }
}

export const controller = new Controler();
