import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {
  public createNewBranch(name, address, details, associateSchemeIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let insertNewBranchQuery = queryhelper.insertNewBranch(
          name,
          address,
          details
        );
        let schemeId = associateSchemeIds[0]?.schemeId
        let insertedBranchResponse =
          await Utility.databaseQuery(insertNewBranchQuery, "Create New Branch");
        if (schemeId) {
          let insertAssocaitedSchemeToBranchQuery =
            queryhelper.insertAssocaitedSchemeToBranch(
              insertedBranchResponse.insertId,
              schemeId
            );
          await Utility.databaseQuery(insertAssocaitedSchemeToBranchQuery, "Map branch and scheme query")
        }
        return resolve({ status: "success", message: "New Branch Created!!!" });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In createnewbranch method");
      }
    });
  }

  public updateBranch(branchId, name, address, details, associateSchemeIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let branchListQuery = queryhelper.getBranches();
        let branchListArray = await Utility.databaseQuery(
          branchListQuery,
          "Get Branch List Query"
        );
        let removedIds = [];
        let addSchemeIds = [];
        branchListArray[0]?.map((singleBranchArray) => {
          let found = false;
          associateSchemeIds.map((singleSchemeId) => {
            if (singleBranchArray.schemeId == singleSchemeId.schemeId) {
              found = true;
            }
          });
          if (!found && singleBranchArray.schemeId) {
            removedIds.push(singleBranchArray.schemeId);
          }
        });
        associateSchemeIds.map((singleSchemeId) => {
          let found = false;
          branchListArray[0]?.map((singleBranchArray) => {
            if (singleBranchArray.schemeId == singleSchemeId.schemeId) {
              found = true;
            }
          });
          if (!found) {
            addSchemeIds.push(singleSchemeId.schemeId);
          }
        });
        addSchemeIds = [...new Set(addSchemeIds)];
        removedIds = [...new Set(removedIds)];
        let deleteBranchSchemeQuery = "";
        removedIds.map((removedId) => {
          deleteBranchSchemeQuery += queryhelper.deleteBranchScheme(
            branchId,
            removedId
          );
        });
        let insertAssocaitedSchemeToBranchQuery = "";
        addSchemeIds.map((singleAddschemeId) => {
          insertAssocaitedSchemeToBranchQuery +=
            queryhelper.insertAssocaitedSchemeToBranch(
              branchId,
              singleAddschemeId
            );
        });
        if (insertAssocaitedSchemeToBranchQuery) {
          await Utility.databaseQuery(
            insertAssocaitedSchemeToBranchQuery,
            "Add New Branch Scheme"
          );
        }
        if (deleteBranchSchemeQuery) {
          await Utility.databaseQuery(
            deleteBranchSchemeQuery,
            "Delete Branch Scheme Query"
          );
        }
        let updateBranchQuery = queryhelper.updateBranch(
          branchId,
          name,
          address,
          details
        );
        await Utility.databaseQuery(updateBranchQuery, "Update Branch Query");
        return resolve({
          status: "success",
          message: "Branch Details Updated Successfully!!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In updateBranch Method");
      }
    });
  }

  public getBranchList(fromDate, toDate, branchId, search) {
    return new Promise(async (resolve, reject) => {
      try {
        let branchQuery = queryhelper.getBranches(
          fromDate,
          toDate,
          branchId,
          search
        );
        let branchResponseWithCount = await Utility.databaseQuery(
          branchQuery,
          "Get Branch List"
        );
        let branchListArray = branchResponseWithCount[0];
        let totalCount = branchResponseWithCount[1][0]?.Count;

        let branchList = [];
        branchListArray.map((singleBranchArray) => {
          try {
            let found = false;
            branchList = branchList.map((singleBranch) => {
              if (singleBranch.branchId == singleBranchArray.branchId) {
                found = true;
                if (singleBranch.associateSchemeIds) {
                  singleBranch.associateSchemeIds.push({
                    schemeId: singleBranchArray.schemeId,
                    name: singleBranchArray.schemeName,
                  });
                } else {
                  singleBranch.associateSchemeIds = [
                    {
                      schemeId: singleBranchArray.schemeId,
                      name: singleBranchArray.schemeName,
                    },
                  ];
                }
              }
              return singleBranch;
            });
            if (!found) {
              singleBranchArray.associateSchemeIds = [
                {
                  schemeId: singleBranchArray.schemeId,
                  name: singleBranchArray.schemeName,
                },
              ];
              delete singleBranchArray.schemeId;
              delete singleBranchArray.schemeName;
              branchList.push({ ...singleBranchArray });
            }
          } catch (error) {
            logger.log("error", error);
          }
        });
        return resolve({
          status: "success",
          branchList,
          totalCount,
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In getBranchList");
      }
    });
  }

  public deleteBranch(branchIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let deleteQuery = "";
        branchIds.map((branchId) => {
          deleteQuery += queryhelper.deleteBranch(branchId);
        });
        await Utility.databaseQuery(deleteQuery, "Delete Branch Query");
        return resolve({
          status: "success",
          message: "Branch Deleted Successfully!!!",
        });
      } catch (error) {
        logger.log("error", JSON.stringify(error));
        return reject("Error In Deleting Branch");
      }
    });
  }
}

export const controller = new Controler();
