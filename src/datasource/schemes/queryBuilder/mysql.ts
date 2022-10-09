import moment from "moment";

class Queryhelper {
  public insertNewScheme(
    name,
    description,
    installmentAmount,
    tenure,
    goldRateType,
    cutOffDays,
    userId
  ) {
    let query = `INSERT INTO SchemeList(Name, Description, InstallmentAmount, 
      Tenure, GoldRateType, CutOffDays,CreatedBy) 
    VALUES ('${name}',"${description}",'${installmentAmount}','${tenure}',
    '${goldRateType}','${cutOffDays}','${userId}')`;
    return query;
  }

  public getSchemeEnrolledIds(userId) {
    let query = `SELECT DISTINCT ENROLL.fk_SchemaId AS schemeId 
    FROM Users JOIN UserType ON UserType.UserTypeId = Users.fk_UserTypeId 
    JOIN SchemeEnrollment AS ENROLL ON ENROLL.fk_UserId = Users.UserId 
    WHERE ENROLL.IsActive = 1 AND Users.UserId = '${userId}'`
    return query
  }

  public getSchemeList(fromDate, toDate, limit, page, SchemaIds, userId?, schemeId?, search?, origin = "mobile") {
    let whereCondition = "SchemeList.IsActive = 1";

    if (origin != "web") {
      SchemaIds.map((singleEnroll, index) => {
        if (index == 0) {
          whereCondition += ` AND (`
        }
        if (index == SchemaIds.length - 1) {
          whereCondition += `SchemeList.SchemaId  != '${singleEnroll.schemeId}')`
        } else {
          whereCondition += `SchemeList.SchemaId  != '${singleEnroll.schemeId}' AND `
        }

      })
    }
    if (fromDate && toDate) {
      whereCondition += ` AND SchemeList.InsertUtc >= '${fromDate}' && SchemeList.InsertUtc <= '${toDate}'`;
    }
    if (schemeId) {
      whereCondition += ` AND SchemeList.SchemaId = ${schemeId}`;
    }
    if (search) {
      whereCondition += ` AND (SchemeList.Name LIKE '%${search}%' || SchemeList.Description LIKE '%${search}%')`;
    }
    let query = `SELECT DISTINCT SchemaId AS schemeId, NumUsers AS totalNumberOfUsers,
    GrossAmount AS grossAmount, Name AS name, Description AS description, 
    InstallmentAmount AS installmentAmount, 
    CASE WHEN GoldRateType = 1 THEN "redeem" 
    WHEN GoldRateType = 0 THEN "enroll"
    END AS goldRateType, 
    Tenure AS tenure, CutOffDays AS cutOffDays, CUSR.Email AS createdByEmail, UUSR.Email AS updatedByEmail 
    FROM SchemeList
    LEFT JOIN Users AS CUSR ON SchemeList.CreatedBy = CUSR.UserId
    LEFT JOIN Users AS UUSR ON SchemeList.UpdatedBy = UUSR.UserId 
    LEFT JOIN SchemeEnrollment AS ENROLL ON ENROLL.fk_SchemaId = SchemeList.SchemaId
    WHERE ${whereCondition} 
    ORDER BY SchemeList.InsertUtc DESC LIMIT ${limit} OFFSET ${page};
    SELECT COUNT(*) AS Count FROM (
    SELECT DISTINCT SchemeList.SchemaId FROM SchemeList
    LEFT JOIN SchemeEnrollment AS ENROLL ON ENROLL.fk_SchemaId = SchemeList.SchemaId
    WHERE ${whereCondition}) AS tbl`;
    return query;
  }

  public updateScheme(
    schemeId,
    name,
    description,
    installmentAmount,
    tenure,
    goldRateType,
    cutOffDays,
    updatedUserId
  ) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");

    let updateValue = "";
    if (name) {
      if (updateValue) {
        updateValue += `, Name = "${name}"`;
      } else {
        updateValue = `Name = "${name}"`;
      }
    }
    if (description) {
      if (updateValue) {
        updateValue += `, Description = "${description}"`;
      } else {
        updateValue = `Description = "${description}"`;
      }
    }
    if (installmentAmount) {
      if (updateValue) {
        updateValue += `, InstallmentAmount = "${installmentAmount}"`;
      } else {
        updateValue = `InstallmentAmount = "${installmentAmount}"`;
      }
    }
    if (tenure) {
      if (updateValue) {
        updateValue += `, Tenure = "${tenure}"`;
      } else {
        updateValue = `Tenure = "${tenure}"`;
      }
    }
    if (goldRateType) {
      if (updateValue) {
        updateValue += `, GoldRateType = "${goldRateType}"`;
      } else {
        updateValue = `GoldRateType = "${goldRateType}"`;
      }
    }
    if (cutOffDays) {
      if (updateValue) {
        updateValue += `, CutOffDays = "${cutOffDays}"`;
      } else {
        updateValue = `CutOffDays = "${cutOffDays}"`;
      }
    }
    if (updatedUserId) {
      if (updateValue) {
        updateValue += `, UpdatedBy = "${updatedUserId}"`;
      } else {
        updateValue = `	UpdatedBy = "${updatedUserId}"`;
      }
    }
    let query = `UPDATE SchemeList SET ${updateValue} , UpdateUtc='${updateUtc}' WHERE SchemaId = ${schemeId}`;
    return query;
  }
  public deleteScheme(schemeId) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE SchemeList SET IsActive = 0 , UpdateUtc='${updateUtc}' WHERE SchemaId = ${schemeId};`;
    return query;
  }
}

export const queryhelper = new Queryhelper();
