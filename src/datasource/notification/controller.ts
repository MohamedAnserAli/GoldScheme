import { notificationConfig } from ".";
import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {
  public createNewNotificationConfig(
    type,
    title,
    message,
    publishedDate,
    userId
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let insertNewNoticiationQuery = queryhelper.insertNewNoticiationConfig(
          type,
          title,
          message,
          publishedDate,
          userId
        );
        await Utility.databaseQuery(
          insertNewNoticiationQuery,
          "Create New Notifications"
        );
        return resolve({
          status: "success",
          message: "New Notification Created!!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error createNewNotification Method");
      }
    });
  }

  public updateNotificationConfig(
    NotifiSmsConfigId,
    type,
    title,
    message,
    publishedDate,
    userId
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateNewNotificationQuery = queryhelper.updateNotificationConfig(
          NotifiSmsConfigId,
          type,
          title,
          message,
          publishedDate,
          userId
        );
        await Utility.databaseQuery(
          updateNewNotificationQuery,
          "Update Notification Query"
        );
        return resolve({
          status: "success",
          message: "Updated Notification Successfully!!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error in updateNewNotification Method");
      }
    });
  }

  public deleteNotificationConfig(notificationConfigIds, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let deleteNotificationConfigQuery = "";
        notificationConfigIds.map((notificationConfigId) => {
          deleteNotificationConfigQuery += queryhelper.deleteNotificationConfig(
            notificationConfigId,
            userId
          );
        });
        await Utility.databaseQuery(
          deleteNotificationConfigQuery,
          "Deelte Notification Configuration"
        );
        return resolve({
          status: "success",
          message: "NotificationIds Deleted Successfully!!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In Deleting Notification Config");
      }
    });
  }
  public getNotificationConfigList(
    fromDate,
    toDate,
    type,
    search,
    notificationConfigId
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let getNotificationConfigQuery = queryhelper.getNotificationConfig(
          fromDate,
          toDate,
          type,
          search,
          notificationConfigId
        );
        let notificationConfigListResponse = await Utility.databaseQuery(
          getNotificationConfigQuery,
          "getNotificationConfigQuery"
        );
        let notificationConfigList = notificationConfigListResponse[0];
        let notificationConfigListCount =
          notificationConfigListResponse[1][0]?.count;
        return resolve({
          status: "success",
          notificationConfigList,
          totalCount: notificationConfigListCount,
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In getNotificationConfigList Method");
      }
    });
  }
}

export const controller = new Controler();
