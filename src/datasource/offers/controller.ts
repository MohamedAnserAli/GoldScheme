import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {

    public addSingleOffer(name, description, amount, knowMore) {
        return new Promise(async (resolve, reject) => {
            try {
                let insertSingeOfferQuery = queryhelper.insertSingeOffer(name, description, amount, knowMore)
                await Utility.databaseQuery(insertSingeOfferQuery, "Insert Singe Offer Query")
                return resolve({ status: "success", message: "Offer Added Successfully!!!" })
            } catch (error) {
                logger.log("error", error)
                return reject(error)
            }
        })
    }

    public getAllOffer(offerId) {
        return new Promise(async (resolve, reject) => {
            try {
                let getOffersListQuery = queryhelper.getOffersList(offerId)
                let offersList = await Utility.databaseQuery(getOffersListQuery, "Get Offers List Query")
                return resolve({ status: "success", offers: offersList })
            } catch (error) {
                logger.log("error", error)
                return reject(error)
            }
        })
    }

    public updateSingleOffer(offerId, name, description, offerAmount, knowMore) {
        return new Promise(async (resolve, reject) => {
            try {
                let updateSingleOfferQuery =
                    queryhelper.updateSingleOffer(offerId, name, description, offerAmount, knowMore)
                await Utility.databaseQuery(updateSingleOfferQuery, "Update Single Offer Query")
                return resolve({ status: "success", message: "Offer Updated Successfully!!!" })
            } catch (error) {
                logger.log("error", error)
                return reject(error)
            }
        })
    }

    public deleteOffers(offerIds) {
        return new Promise(async (resolve, reject) => {
            try {
                let deleteOffersQuery = queryhelper.deleteOffers(offerIds)
                await Utility.databaseQuery(deleteOffersQuery, "Delete Offers Query")
                return resolve({ status: "success", message: "Offer Deleted Successfully!!!" })
            } catch (error) {
                logger.log("error", error)
                return reject(error)
            }
        })
    }
}

export const controller = new Controler();
