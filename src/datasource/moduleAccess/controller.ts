import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {

    public getModuleAccessForSingleUserId(userId, apiPath) {
        return new Promise(async (resolve, reject) => {
            try {
                let moduleAccessQuery = await queryhelper.getModuleAccess(userId, apiPath)
                let moduleAccessResponse = await Utility.databaseQuery(moduleAccessQuery, "Get Module Access Query")
                return resolve(moduleAccessResponse[0])
            } catch (error) {
                logger.log("error", error)
            }
        })
    }
}

export const controller = new Controler();
