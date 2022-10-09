class Queryhelper {
  public getMonthlyNewCustomer() {
    let query = `SELECT COUNT(*) AS count FROM Users 
    WHERE IsActive = 1 AND (YEAR(InsertUtc) = YEAR(CURRENT_DATE()) || YEAR(InsertUtc) = YEAR(CURRENT_DATE()) -1);
    SELECT COUNT(*) AS count, MONTHNAME(InsertUtc) AS month, MONTH(InsertUtc) AS numMonth 
    FROM Users WHERE IsActive = 1 AND (YEAR(InsertUtc) = YEAR(CURRENT_DATE()) || YEAR(InsertUtc) = YEAR(CURRENT_DATE()) -1) 
    GROUP BY MONTH(InsertUtc) ORDER BY InsertUtc DESC LIMIT 12;`;
    return query;
  }

  public getMonthlyPaidAmountPerScheme() {
    let query = `SELECT SUM(DueAmount) AS totalAmount FROM Ledger 
    WHERE (YEAR(InsertUtc) = YEAR(CURRENT_DATE()) || YEAR(InsertUtc) = YEAR(CURRENT_DATE()) -1) AND 
    IsPaid = 1 AND PaidDate IS NOT null;
    SELECT SUM(DueAmount) AS amount, MONTHNAME(PaidDate) AS month FROM Ledger 
    WHERE (YEAR(InsertUtc) = YEAR(CURRENT_DATE()) || YEAR(InsertUtc) = YEAR(CURRENT_DATE()) -1) AND 
    IsPaid = 1 AND PaidDate IS NOT null GROUP BY MONTH(PaidDate) ORDER BY MONTH(PaidDate) DESC LIMIT 12;
    `;
    return query;
  }

  public topPerformingBranch(top = false) {
    let limit = "";
    if (top) {
      limit = "LIMIT 1";
    }
    if (!top) {
      limit = "LIMIT 5";
    }
    let query = `SELECT SchemeList.SchemaId, SUM(Ledger.DueAmount) AS totalPaidAmount,
    Ledger.LedgerId, Branch.BranchId AS branchId, Branch.Name AS branchName FROM Ledger 
    JOIN SchemeEnrollment ON SchemeEnrollment.EnrollmentId = Ledger.fk_EnrollmentId 
    JOIN Users ON SchemeEnrollment.fk_UserId = Users.UserId 
    JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    JOIN Branch ON Branch.BranchId = Users.fk_branchId 
    WHERE Ledger.IsPaid = 1 AND SchemeEnrollment.IsActive = 1 AND
    YEAR(Ledger.PaidDate) = YEAR(CURRENT_DATE()) AND MONTH(Ledger.PaidDate) = MONTH(CURRENT_DATE()) 
    GROUP BY Branch.BranchId ORDER BY totalPaidAmount DESC ${limit};
    `;
    return query;
  }

  public topPerformaingScheme(top = false, lastMonth = false, schemeId = "") {
    let limit = "";
    if (top) {
      limit = "LIMIT 1";
    }
    if (!top) {
      limit = "LIMIT 5";
    }
    let currentMonth = "MONTH(CURRENT_DATE())";
    if (lastMonth) {
      currentMonth = `MONTH(CURRENT_DATE()) - 1 `;
    }
    if (schemeId) {
      currentMonth += ` AND SchemeList.SchemaId = ${schemeId}`;
    }
    let query = `SELECT SchemeList.Name AS schemeName, SchemeList.SchemaId AS schemeId, 
    SUM(Ledger.DueAmount) AS totalPaidAmount,
    Ledger.LedgerId, Branch.BranchId, Branch.Name  AS branchName
    FROM Ledger 
    JOIN SchemeEnrollment ON SchemeEnrollment.EnrollmentId = Ledger.fk_EnrollmentId 
    JOIN Users ON SchemeEnrollment.fk_UserId = Users.UserId 
    JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    JOIN Branch ON Branch.BranchId = Users.fk_branchId 
    WHERE Ledger.IsPaid = 1 AND SchemeEnrollment.IsActive = 1 AND
    YEAR(Ledger.PaidDate) = YEAR(CURRENT_DATE()) AND MONTH(Ledger.PaidDate) =  ${currentMonth} 
    GROUP BY SchemeList.SchemaId ORDER BY totalPaidAmount DESC ${limit};
    `;
    return query;
  }
  public userEnrolledInTopPerformingBranch(key, value, table) {
    let query = `SELECT COUNT(*) AS usersEnrolled FROM ${table} WHERE IsActive = 1 AND ${key} = '${value}';`;
    return query;
  }

  public missedInstallmentsQuery() {
    let query = `SELECT SUM(DueAmount) AS missedInstallmentAmount 
      FROM Ledger 
      WHERE IsPaid = 2 AND YEAR(Ledger.DueDate) = YEAR(CURRENT_DATE()) AND 
      MONTH(Ledger.DueDate) = MONTH(CURRENT_DATE());
    SELECT SUM(DueAmount) AS missedInstallmentAmount 
    FROM Ledger 
    WHERE IsPaid = 2 AND YEAR(Ledger.DueDate) = YEAR(CURRENT_DATE()) AND 
    MONTH(Ledger.DueDate) = MONTH(CURRENT_DATE()) - 1;
    `;
    return query;
  }

  public lastMonthRedeemedAmount() {
    let query = `SELECT SUM(RedeemAmount) AS totalRedeemedAmount 
    FROM Redeem WHERE YEAR(RedeemDate) = YEAR(CURRENT_DATE()) AND 
    MONTH(RedeemDate) = MONTH(CURRENT_DATE()) -1 
    GROUP BY MONTH(RedeemDate) ORDER BY RedeemDate DESC;`;
    return query;
  }
  public expectedRedeemAmount() {
    let query = `SELECT SUM(SchemeList.Tenure * SchemeList.InstallmentAmount) AS pendingRedeemAmount 
    FROM SchemeEnrollment 
    JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    WHERE RemainingInstallments = 1 AND Is_Redeemed = 0;
    `;
    return query;
  }

  public notRedeemedUserCount() {
    let query = `SELECT COUNT(fk_UserId) AS userCount 
    FROM SchemeEnrollment 
    JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    WHERE RemainingInstallments = 0 AND Is_Redeemed = 0 GROUP BY SchemeEnrollment.fk_UserId;`;
    return query;
  }
  public expectedUserCount() {
    let query = `SELECT COUNT(fk_UserId) AS userCount 
    FROM SchemeEnrollment 
    JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    WHERE RemainingInstallments = 1 AND Is_Redeemed = 0 GROUP BY SchemeEnrollment.fk_UserId;`;
    return query;
  }
  public pendingRedeemAmount() {
    let query = `SELECT SUM(SchemeList.Tenure * SchemeList.InstallmentAmount) AS pendingRedeemAmount 
    FROM SchemeEnrollment 
    JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    WHERE RemainingInstallments = 0 AND Is_Redeemed = 0;
    `;
    return query;
  }
  public getRedeemedUserPerMonth() {
    let query = `SELECT COUNT(*) AS count,userId,month FROM 
    (SELECT DISTINCT fk_UserId AS userId ,MONTHNAME(RedeemDate) AS month 
    FROM SchemeEnrollment WHERE Is_Redeemed = 1 AND 
    (YEAR(SchemeEnrollment.RedeemDate) = YEAR(CURRENT_DATE()) 
    || YEAR(SchemeEnrollment.RedeemDate) = YEAR(CURRENT_DATE()) -1) ORDER BY RedeemDate DESC) AS TBL 
    GROUP BY TBL.month;
    `;
    return query;
  }

  public totalTopPerformingScheme() {
    let query = `SELECT SUM(InitialInstallmentAmount) AS totalAmount ,
    COUNT(fk_UserId) AS usersEnrolled, InitialSchemeName AS schemeName 
    FROM SchemeEnrollment 
    WHERE 1 GROUP BY fk_SchemaId ORDER BY totalAmount DESC;`
    return query
  }

  public totalTopPerformingBranch() {
    let query = `SELECT SchemeList.NumUsers AS usersEnrolled, SUM(Ledger.DueAmount) AS totalAmount,
    Branch.Name AS branchName FROM Ledger 
    JOIN SchemeEnrollment ON SchemeEnrollment.EnrollmentId = Ledger.fk_EnrollmentId 
    JOIN Users ON SchemeEnrollment.fk_UserId = Users.UserId 
    JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId 
    JOIN Branch ON Branch.BranchId = Users.fk_branchId 
    WHERE Ledger.IsPaid = 1 AND SchemeEnrollment.IsActive = 1
    GROUP BY Branch.BranchId ORDER BY totalAmount DESC;
    `
    return query
  }

  public totalMissedInstallments() {
    let query = `SELECT SUM(DueAmount) AS missedInstallmentAmount 
    FROM Ledger 
    WHERE IsPaid = 2`
    return query
  }
}

export const queryhelper = new Queryhelper();
