import e from "express"

class Queryhelper {
    public insertSingeOffer(name, description, amount, knowMore) {
        let query = `INSERT INTO Offers(Name, Description, OfferAmount, KnowMore) 
        VALUES ('${name}','${description}','${amount}','${knowMore}')`
        return query
    }

    public getOffersList(offerId) {
        let whereCondition = ""
        if (offerId) {
            whereCondition = ` AND OfferId = ${offerId}`
        }
        let query = `SELECT OfferId AS offerId, Name AS name, Description AS description, OfferAmount AS offerAmount, 
        KnowMore AS knowMore FROM Offers WHERE IsActive = 1 ${whereCondition}`
        return query
    }

    public updateSingleOffer(offerId, name, description, offerAmount, knowMore) {
        let updateQuery = ""
        if (name) {
            if (updateQuery) {
                updateQuery += ` ,Name='${name}'`
            } else {
                updateQuery += ` Name='${name}' `
            }

        }
        if (description) {
            if (updateQuery) {
                updateQuery += `, Description='${description}'`
            } else {
                updateQuery += `Description='${description}'`
            }
        }
        if (offerAmount) {
            if (updateQuery) {
                updateQuery += `, OfferAmount='${offerAmount}'`
            } else {
                updateQuery += `OfferAmount='${offerAmount}'`
            }
        }
        if (knowMore) {
            if (updateQuery) {
                updateQuery += `, KnowMore='${knowMore}'`
            } else {
                updateQuery += `KnowMore='${knowMore}'`
            }
        }
        let query = `UPDATE Offers SET ${updateQuery} WHERE OfferId = ${offerId}`
        return query
    }

    public deleteOffers(offerId) {
        let query = `UPDATE Offers SET IsActive = 0 WHERE OfferId IN (${offerId})`
        return query
    }
}

export const queryhelper = new Queryhelper();
