import moment from "moment";

class Queryhelper {
  public createTransaction(installmentId) {
    let query = `INSERT INTO Transaction(fk_LedgerId) VALUES ('${installmentId}')`;
    return query;
  }
  public checkValidInstallment(ledgerId, schemeEnrollmentId, userId) {
    let query = `SELECT Ledger.DueAmount AS dueAmount, 
      SchemeList.Tenure AS tenure FROM Ledger 
      JOIN SchemeEnrollment ENROLL ON ENROLL.EnrollmentId = Ledger.fk_EnrollmentId
      JOIN SchemeList ON SchemeList.SchemaId = ENROLL.fk_SchemaId   
      JOIN Users ON Users.UserId = ENROLL.fk_userId
      WHERE Ledger.LedgerId = '${ledgerId}' AND Ledger.fk_EnrollmentId = '${schemeEnrollmentId}' AND 
      Users.UserId = '${userId}';`;
    return query;
  }
  public updateTransactionDetails(transactionDetails, transactionId) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE Transaction SET Details='${transactionDetails}' ,UpdateUtc='${updateUtc}' 
    WHERE TransactionId = '${transactionId}'`;
    return query;
  }
  public updatePaymentStatus(userId, mode, installmentId) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE Ledger SET IsPaid = 1 ,PaidDate='${updateUtc}',fk_UserId='${userId}',
    Mode='${mode}',UpdatUtc='${updateUtc}' WHERE LedgerId = '${installmentId}'`;
    return query;
  }
  public getSchemeIdUsingEnrollmentId(enrollmentId) {
    let query = `SELECT fk_SchemaId AS schemeId FROM SchemeEnrollment WHERE EnrollmentId = ${enrollmentId};`;
    return query;
  }
  public getGrossAmountForScheme(schemeEnrollmentId) {
    let query = `
    SELECT SUM(DueAmount) AS grossAmount ,COUNT(*) AS count  FROM Ledger 
    JOIN SchemeEnrollment ON SchemeEnrollment.EnrollmentId = Ledger.fk_EnrollmentId 
    JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    WHERE SchemeEnrollment.EnrollmentId = ${schemeEnrollmentId} AND Ledger.IsPaid = 1;`;
    return query;
  }

  public updateGrossAmount(grossAmount, schemeId) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE SchemeList SET GrossAmount = '${grossAmount}',
     UpdateUtc='${updateUtc}' WHERE SchemaId = ${schemeId}`;
    return query;
  }

  public getCurrentGoldPrice() {
    let date = moment(new Date()).tz("UTC").format("YYYY-MM-DD");
    let query = `SELECT Price AS price FROM RateCard WHERE Date = '${date}' ORDER BY InsertUtc DESC LIMIT 1;`;
    return query;
  }

  public updateAccRate(accGold, ledgerId) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE Ledger SET GoldAccumulated='${accGold}', UpdatUtc='${updateUtc}' 
    WHERE LedgerId = "${ledgerId}";`;
    return query;
  }

  public getTotalAccmRate(enrollmentId) {
    let query = `SELECT SUM(GoldAccumulated) AS goldAccumulated FROM Ledger WHERE fk_EnrollmentId = '${enrollmentId}';`;
    return query;
  }

  public updateTotalAccum(accGold, enrollmentId, remainingInstallments) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE SchemeEnrollment SET RemainingInstallments = '${remainingInstallments}', AccGold ='${accGold}', 
    UpdateUtc ='${updateUtc}' WHERE EnrollmentId = '${enrollmentId}';`;
    return query;
  }

  public getRedeemSchemeDetailsQuery(schemeEnrollmentId) {
    let query = `SELECT SchemeList.Tenure * SchemeList.InstallmentAmount AS redeemAmount 
    FROM SchemeEnrollment JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    WHERE RemainingInstallments = 0 AND Is_Redeemed = 0 AND SchemeEnrollment.EnrollmentId = '${schemeEnrollmentId}';
    `;
    return query;
  }
  public insertRedeemInfoQuery(schemeEnrollmentId, redeemAmount) {
    let query = `INSERT INTO Redeem(fk_SchemeEnrollmentId, RedeemDate, RedeemAmount) 
    VALUES ('${schemeEnrollmentId}',NOW(),'${redeemAmount}')`;
    return query;
  }
  public redeemSchemeQuery(schemeEnrollmentId) {
    let query = `UPDATE SchemeEnrollment SET Is_Redeemed = 1 , 
    RedeemDate = NOW() WHERE Is_Redeemed = 0 AND EnrollmentId = '${schemeEnrollmentId}' 
    AND RemainingInstallments = 0;`;
    return query;
  }

  public activeScheme(schemeEnrollmentId, activate) {
    let IsActive = 0
    if (activate == "true") {
      IsActive = 1
    }
    let query = `UPDATE SchemeEnrollment SET IsActive ='${IsActive}' 
    WHERE EnrollmentId = '${schemeEnrollmentId}'`
    return query
  }
}

export const queryhelper = new Queryhelper();
