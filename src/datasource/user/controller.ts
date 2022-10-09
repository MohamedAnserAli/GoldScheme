import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {
  public createNewUser(
    firstName: string,
    lastName: string,
    email: string,
    panNumber: string,
    mobile: number,
    address: string,
    branchId: string,
    userType: string,
    userId: string
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let insertNewUserQuery: string = queryhelper.insertNewUser(
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
        await Utility.databaseQuery(insertNewUserQuery, "Insert New User");
        return resolve({
          status: "success",
          message: "New User Created!!!",
        });
      } catch (error) {
        logger.log("error", JSON.stringify(error));
        return reject(error);
      }
    });
  }
  public getUsers(
    fromDate,
    toDate,
    limit,
    offset,
    userId?,
    search?,
    userType?,
    mobile?,
    schemaIds?,
    branchIds?
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let getUsersListQuery = queryhelper.getUserList(
          fromDate,
          toDate,
          limit,
          offset,
          userId,
          search,
          userType,
          mobile,
          schemaIds,
          branchIds
        );
        let userListWithCount = await Utility.databaseQuery(
          getUsersListQuery,
          "GET Users List"
        );
        let userList = userListWithCount[0];
        let userCount = userListWithCount[1][0]?.count;
        return resolve({ status: "success", userList, totalCount: userCount });
      } catch (error) {
        logger.log("error", JSON.stringify(error));
        return reject("Error In getUsers Controller");
      }
    });
  }
  public updateUser(
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
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateUserQuery = queryhelper.updateUser(
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
        await Utility.databaseQuery(updateUserQuery, "Update User Info");
        return resolve({
          status: "success",
          message: "User Info Updated Successfully!!!",
        });
      } catch (error) {
        logger.log("error", JSON.stringify(error));
        return reject("Error In Update User Method");
      }
    });
  }
  public deleteUser(userIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let deleteQuery = "";
        userIds.map((userId) => {
          deleteQuery += queryhelper.deleteUser(userId);
        });
        await Utility.databaseQuery(deleteQuery, "Delete Users Query");
        return resolve({
          status: "success",
          message: "User Deleted Successfully!!!",
        });
      } catch (error) {
        logger.log("error", JSON.stringify(error));
        return reject("Error In Deleting User");
      }
    });
  }
  public checkMobile(mobileNumber) {
    return new Promise(async (resolve, reject) => {
      try {
        let checkMobileNumberQuery =
          queryhelper.mobileNumberCheck(mobileNumber);
        let mobileNumberResponse = await Utility.databaseQuery(
          checkMobileNumberQuery,
          "Check Mobile Number"
        );
        return resolve(mobileNumberResponse);
      } catch (error) {
        logger.log("error", error);
        return reject("Error In checkMobile Function");
      }
    });
  }
  public getUserType() {
    return new Promise(async (resolve, reject) => {
      try {
        let userTypeQuery = queryhelper.getUserTypelist();
        let finalResponse = await Utility.databaseQuery(
          userTypeQuery,
          "Get UserType List"
        );
        return resolve({ status: "success", userType: finalResponse });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In getUserType Method");
      }
    });
  }
  public saveTwoFactorSessionToken(sessionId, mobile) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateSessionQuery = queryhelper.loginSessionInfo(
          sessionId,
          mobile
        );
        await Utility.databaseQuery(
          updateSessionQuery,
          "Query Update Session Query"
        );
        return resolve({
          status: "success",
          message: "OTP sent Successfully!!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject(error);
      }
    });
  }
  public getSessionId(mobile) {
    return new Promise(async (resolve, reject) => {
      try {
        let userSessionQuery = queryhelper.getUserSessionId(mobile);
        let sessionIdResponse = await Utility.databaseQuery(
          userSessionQuery,
          "Get User Session Query"
        );
        let sessionId = sessionIdResponse[0].sessionId;
        return resolve(sessionId);
      } catch (error) {
        logger.log("error", error);
        return reject("Error In getSessionId method");
      }
    });
  }

  public updateLastLoggin(mobile) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateLastLogginQuery = queryhelper.updateLastLogin(mobile);
        await Utility.databaseQuery(
          updateLastLogginQuery,
          "Update Login Query"
        );
        return resolve("last login updated");
      } catch (error) {
        logger.log("error", error);
        return reject(error);
      }
    });
  }
  public updateUserIdInoAuth(uuid, hash, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateUserIdAuthQuery = queryhelper.updateUserIdAuthQuery(
          uuid,
          hash,
          userId
        );
        await Utility.databaseQuery(
          updateUserIdAuthQuery,
          "Update UserId Auth Query"
        );
        return resolve("success");
      } catch (error) {
        logger.log("error", error);
        return reject("Error In updating UserId in oAuth");
      }
    });
  }

  public moduleAccessController(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let moduleAccessQuery = queryhelper.getModuleAccessQuery(userId)
        let moduleAccessResponse = await Utility.databaseQuery(moduleAccessQuery, "Module Access Query");
        return resolve(JSON.stringify(moduleAccessResponse))

      } catch (error) {
        logger.log("error", error)
        return reject(error);
      }
    })
  }
}

export const controller = new Controler();
