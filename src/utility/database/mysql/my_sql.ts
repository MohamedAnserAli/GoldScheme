import { logger } from "../../../log/logger";
import * as mysql from "mysql";
import * as mysqlUtilities from "mysql-utilities";
import { environment } from "../../../environment/environment";
const q = require("q");

class MysqlDBConnection {
  public pool!: mysql.Pool;

  constructor() {
    this.configDB();
    this.pool.on("connection", this.poolConnectionCallBack);
  }

  private poolConnectionCallBack(connection: any): void {
    mysqlUtilities.upgrade(connection);
    mysqlUtilities.introspection(connection);
  }

  private configDB() {
    this.pool = mysql.createPool({
      connectionLimit: 25, //important
      host: environment.MySQLConfig.host,
      user: environment.MySQLConfig.user,
      password: environment.MySQLConfig.password,
      database: environment.MySQLConfig.database,
      port: +environment.MySQLConfig.port,
      multipleStatements: true,
      waitForConnections: true,
      debug: false,
    });

    this.pool.on("acquire", (connection: any) => {
      logger.log(
        "debug",
        "Connection acquired from connection pool...Connection %s acquired",
        connection.threadId
      );
    });

    this.pool.on("connection", (connection: any) => {
      logger.debug("**** New MySQL connection is made ****");
      mysqlUtilities.upgrade(connection);
      mysqlUtilities.introspection(connection);
    });

    this.pool.on("enqueue", () => {
      logger.info("Waiting for available DB connection slot !!!!!!!!!!");
    });

    this.pool.on("release", (connection: any) => {
      logger.debug(
        "Connection %d is released back to the pool",
        connection.threadId
      );
    });
  }

  public getConnection(transaction: boolean, callback: any) {
    if (typeof transaction == "function") {
      callback = transaction;
      transaction = false;
    }
    this.pool.getConnection((err: any, connection: any) => {
      if (err) {
        if (connection) {
          connection.release();
        }
        return callback(err, connection);
      } else {
        connection.connect();
        if (transaction) {
          connection.beginTransaction(function (err: any) {
            if (err) {
              return callback(err, connection);
            } else {
              callback(null, connection);
            }
          });
        } else {
          callback(null, connection);
        }
      }
    });
  }
}

export const DBConnection = new MysqlDBConnection();
