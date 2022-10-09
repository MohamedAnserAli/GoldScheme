import { logger } from "../../../log/logger";
import { DBConnection } from "./my_sql";
import { ServerError } from "../../../Exceptions/Error";
const util = require("util");
const q = require("q");

export class Utility {
  public static executeCRUDQuery(
    connection: any,
    sqlQuery: string,
    parameters: any,
    description?: string
  ) {
    let deferred = q.defer();
    let result = connection.query(
      sqlQuery,
      parameters,
      function (err: any, res: any) {
        logger.log(
          "debug",
          "AssetServiceDAO :: %s ,Query : %s",
          description,
          result.sql
        );
        if (err) {
          logger.log(err);
          deferred.reject(new ServerError(err.message || err.toString()));
        } else {
          deferred.resolve(res);
        }
      }
    );
    return deferred.promise;
  }

  public static getDBConnection(isTransaction: boolean = false) {
    let deferred = q.defer();
    DBConnection.getConnection(isTransaction, (err: any, connection: any) => {
      if (err) {
        logger.error(
          "Error while getting the DBConnection" + err.message || err.toString()
        );
        deferred.reject(new ServerError("DB Connection error"));
      } else {
        deferred.resolve(connection);
      }
    });
    return deferred.promise;
  }

  public static closeDBConnection(connection: any) {
    try {
      if (connection && connection["isConnectionAlive"]) {
        connection["isConnectionAlive"] = false;
        connection.release();
      }
    } catch (err) {
      logger.error(
        "Error occurred while trying to release dbConnection :" +
          util.inspect(err, {
            showHidden: false,
            depth: null,
          })
      );
    }
  }

  public static databaseQuery(query: any, description: any) {
    let deffered = q.defer();
    let DBConnection: any;
    Utility.getDBConnection(false)
      .then((connection: any) => {
        DBConnection = connection;
        DBConnection["isConnectionAlive"] = true;
        return Utility.executeCRUDQuery(DBConnection, query, [], description);
      })
      .then((result: any) => {
        Utility.closeDBConnection(DBConnection);
        deffered.resolve(result);
      })
      .catch((err: any) => {
        logger.log("error", err);
        Utility.closeDBConnection(DBConnection);
        deffered.reject([]);
      });
    return deffered.promise;
  }
}
