import moment from "moment";

class Queryhelper {
  public getYesterdayRateCardPrice() {
    let date = moment(new Date())
      .subtract(1, "days")
      .tz("UTC")
      .format("YYYY-MM-DD");
    let query = `SELECT Price AS price FROM RateCard WHERE Date = '${date}' ORDER BY InsertUtc DESC`;
    return query;
  }
  public insertRateCard(name, price, date) {
    let query = `INSERT INTO RateCard(Name, Price, Date) VALUES ('${name}','${price}','${date}')`;
    return query;
  }

  public getCurrentGoldPrice() {
    let date = moment(new Date()).tz("UTC").format("YYYY-MM-DD");
    let query = `SELECT Price AS price FROM RateCard WHERE Date = '${date}' ORDER BY InsertUtc DESC LIMIT 1;`;
    return query;
  }

  public getInstallmentsDueDate() {
    let query = `UPDATE Ledger SET IsPaid = 2 , UpdatUtc = NOW() 
      WHERE LedgerId IN (SELECT Ledger.LedgerId AS id FROM Ledger 
      JOIN SchemeEnrollment ENROLL ON ENROLL.EnrollmentId = Ledger.fk_EnrollmentId 
      JOIN SchemeList AS SL ON SL.SchemaId = ENROLL.fk_SchemaId 
      WHERE Ledger.IsPaid = 0 && DATE_ADD(Ledger.DueDate, INTERVAL SL.Tenure DAY) < CURRENT_DATE());`;
    return query;
  }
}

export const queryhelper = new Queryhelper();
