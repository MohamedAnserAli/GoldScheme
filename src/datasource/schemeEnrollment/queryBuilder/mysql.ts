import moment from "moment";

class Queryhelper {
  public getRateCardId() {
    let from = moment.utc().format("YYYY-MM-DD");
    let to = moment.utc().add(1, "days").format("YYYY-MM-DD");

    let query = `SELECT RateCardId AS rateCardId FROM RateCard WHERE Date >= '${from}' AND Date <= '${to} 
    ORDER BY Date DESC'`;
    return query;
  }
  public insertSchemeEnrollnment(
    userId,
    schemeId,
    rateCardId,
    remainingInstallments,
    schemeName,
    schemeDescription,
    schemeInstallmentAmount
  ) {
    let query = `INSERT INTO SchemeEnrollment(fk_UserId, fk_SchemaId, Is_Redeemed, RemainingInstallments, 
            fk_RateCardId, InitialSchemeName, InitialSchemeDescription, InitialInstallmentAmount) 
            VALUES ('${userId}','${schemeId}',0,'${remainingInstallments}','${rateCardId}',
            '${schemeName}',"${schemeDescription}",'${schemeInstallmentAmount}');`;
    return query;
  }

  public insertLedgerInfo(tenure, fk_EnrollmentId, dueAmount) {
    let ledgerInsertQuery = "";
    for (let i = 0; i < tenure; i++) {
      let dueDate = moment().add(i, "M").format("YYYY/MM/DD");
      ledgerInsertQuery += `INSERT INTO Ledger(fk_EnrollmentId, DueAmount, DueDate, IsPaid,InstallmentNumber) 
      VALUES ('${fk_EnrollmentId}','${dueAmount}','${dueDate}',0,'${i + 1}');`;
    }
    return ledgerInsertQuery;
  }
  public checkUserIdAndSchemeId(userId, schemeId) {
    let query = `SELECT * FROM Users WHERE IsActive = 1 AND UserId = ${userId};
    SELECT * FROM SchemeList WHERE IsActive = 1 AND SchemaId = ${schemeId};
    SELECT * FROM SchemeEnrollment WHERE fk_UserId = ${userId} AND fk_SchemaId = ${schemeId}`;
    return query;
  }
  public getFirstInstallmentNumber(schemeEnrollmentId) {
    let query = `SELECT LedgerId AS firstInstallmentNumber,DueAmount AS dueAmount FROM Ledger 
    WHERE fk_EnrollmentId = '${schemeEnrollmentId}' AND InstallmentNumber = 1 AND IsPaid = 0`
    return query
  }
  public getEnrolledScheme(userId) {
    let query = `SELECT ENROLL.EnrollmentId AS schemeEnrollmentId, ENROLL.InitialSchemeName AS schemeName, 
    ENROLL.InitialSchemeDescription AS schemeDescription, ENROLL.InitialInstallmentAmount AS installmentAmount, SL.Tenure AS numberOfInstallment, 
    ENROLL.AccGold AS totalGoldAccumulated, SL.InstallmentAmount * SL.Tenure AS maturityAmount, 
    DATE_FORMAT(ENROLL.EnrollDate,'%Y-%m-%d') AS enrollDate, ENROLL.RemainingInstallments AS remainingInstallment,
    DATE_FORMAT(DATE_ADD(ENROLL.EnrollDate, INTERVAL SL.Tenure - ENROLL.RemainingInstallments MONTH),'%Y-%m-%d')
    AS nextInstallmentDate, Ledger.DueAmount AS dueAmount , Ledger.LedgerId AS installmentId,
    CASE WHEN Ledger.IsPaid = 0 THEN "Not Paid" 
    WHEN Ledger.IsPaid = 1 THEN "Paid"
    WHEN Ledger.IsPaid = 2 THEN "Missed"
    END AS isPaid,
    DATE_FORMAT(Ledger.DueDate,'%Y-%m-%d') AS dueDate, Ledger.InstallmentNumber AS installmentNumber, 
    Ledger.GoldAccumulated AS goldAccumulated, 
    CASE WHEN Ledger.Mode = 0 THEN "web" 
    WHEN Ledger.Mode = 1 THEN "mobile"
    END AS mode, 
    Ledger.PaidDate AS paidDate
    FROM SchemeEnrollment AS ENROLL
    JOIN SchemeList AS SL ON SL.SchemaId = ENROLL.fk_SchemaId 
    JOIN Ledger ON Ledger.fk_EnrollmentId = ENROLL.EnrollmentId 
    WHERE ENROLL.IsActive = 1 AND ENROLL.fk_UserId = ${userId} ORDER BY Ledger.InstallmentNumber ASC;
    SELECT COUNT(*) AS Count FROM SchemeEnrollment AS ENROLL 
    JOIN SchemeList AS SL ON SL.SchemaId = ENROLL.fk_SchemaId 
    WHERE ENROLL.IsActive = 1 AND ENROLL.fk_UserId = ${userId};`;
    return query;
  }

  public getTotalSchemeAndAmountPerScheme(schemeId, userId) {
    let query = `SELECT COUNT(*) AS count FROM SchemeEnrollment
    JOIN SchemeList AS SL ON SL.SchemaId = SchemeEnrollment.fk_SchemaId
    WHERE SL.SchemaId = ${schemeId};
    SELECT COUNT(*) AS count FROM SchemeEnrollment WHERE fk_UserId = "${userId}";`;
    return query;
  }

  public updateNumUserSchemeCout(numUsers, schemeCount, schemeId, userId) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE SchemeList SET NumUsers = '${numUsers}',
     UpdateUtc='${updateUtc}' WHERE SchemaId = ${schemeId};
     UPDATE Users SET NumSchEnroll='${schemeCount}',UpdateUtc='${updateUtc}' 
     WHERE UserId = ${userId}`;
    return query;
  }

  public activeScheme(userId, schemeId, activate) {
    let IsActive = 0
    if (activate == "true") {
      IsActive = 1
    }
    let query = `UPDATE SchemeEnrollment SET IsActive ='${IsActive}' 
    WHERE fk_UserId = '${userId}' AND fk_SchemaId = '${schemeId}'`
    return query
  }
}

export const queryhelper = new Queryhelper();
