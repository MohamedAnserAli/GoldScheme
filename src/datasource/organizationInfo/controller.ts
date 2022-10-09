import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {

    public getOrganizationInformation() {
        return new Promise(async (resolve, reject) => {
            try {
                let organizationInfoQuery = queryhelper.getOrganizationInfo()
                let organizationInfoResponse =
                    await Utility.databaseQuery(organizationInfoQuery, "Get Organization Info Query")
                organizationInfoResponse = organizationInfoResponse.pop()
                return resolve(organizationInfoResponse)
            } catch (error) {
                logger.log("error", error)
                return reject(error)
            }
        })
    }

    public createOrganizationInformation(name, address) {
        return new Promise(async (resolve, reject) => {
            try {
                let organizationInfoQuery = queryhelper.getOrganizationInfo()
                let organizationInfoResponse =
                    await Utility.databaseQuery(organizationInfoQuery, "Get Organization Info Query")
                if (organizationInfoResponse.length > 0) {
                    return resolve({ status: "failure", message: "Organization Info Exist!!" })
                }
                let createOrganizationQuery = queryhelper.createOrganizationInfo(name, address)
                await Utility.databaseQuery(createOrganizationQuery, "Create Organization Query")
                return resolve({ status: "success", message: "Organization Information Added Successfully!!!" })
            } catch (error) {
                logger.log("error", error)
                return reject(error)
            }
        })
    }
}

export const controller = new Controler();
