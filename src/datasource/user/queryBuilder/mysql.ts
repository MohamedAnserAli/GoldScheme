import moment from "moment";

class Queryhelper {
  public insertNewUser(
    firstName: string,
    lastName: string,
    email: string,
    panNumber: string,
    mobile: number,
    address: string,
    branchId: string,
    userType: string,
    userId: string = null
  ) {
    let value = ",CreatedBy"
    let creatdByValue = null
    if (userId) {
      creatdByValue = `'${userId}'`
    }
    let query = `INSERT INTO Users(FirstName, LastName, Email, PanNumber, Mobile, 
      Address,fk_BranchId, fk_UserTypeId,IsActive ${value}) 
    VALUES ('${firstName}','${lastName}','${email}','${panNumber}','${mobile}','${address}',
    '${branchId}','${userType}',0, ${creatdByValue})`;
    return query;
  }
  public getUserList(
    fromDate,
    toDate,
    limit,
    offset,
    userId?,
    search?,
    userTypes?,
    mobile?,
    schemaIds?,
    branchIds?
  ) {
    let whereCondition = "(USR.IsActive = 1 || (USR.IsActive = 0 && USR.lastLoggedIn IS NULL))";

    if (branchIds) {
      whereCondition += ` AND BCH.IsActive = 1 AND (`
      branchIds.map((branchId, index) => {
        if (index == branchIds.length - 1) {
          whereCondition += ` BCH.BranchId = '${branchId}')`
        } else {
          whereCondition += ` BCH.BranchId = '${branchId}' ||`
        }
      })
    }

    if (schemaIds) {
      whereCondition += ` AND SchemeList.IsActive = 1 AND (`
      schemaIds.map((schemeId, index) => {
        if (index == schemaIds.length - 1) {
          whereCondition += ` SchemeList.SchemaId = '${schemeId}')`
        } else {
          whereCondition += ` SchemeList.SchemaId = '${schemeId}' ||`
        }
      })
    }

    if (userTypes) {
      whereCondition += ` AND (`
      userTypes.map((userType, index) => {
        if (index == userTypes.length - 1) {
          whereCondition += ` USR.fk_UserTypeId = '${userType}')`
        } else {
          whereCondition += ` USR.fk_UserTypeId = '${userType}' ||`
        }
      })
    }
    if (fromDate && toDate) {
      whereCondition += ` AND USR.InsertUtc >= '${fromDate}' && USR.InsertUtc <= '${toDate}'`;
    }

    if (userId) {
      whereCondition += ` AND USR.UserId = ${userId}`;
    }

    if (search) {
      whereCondition += ` AND (FirstName LIKE '%${search}%' || LastName LIKE '%${search}%')`;
    }
    if (mobile) {
      whereCondition += ` AND USR.Mobile LIKE '%${mobile}%'`;
    }


    let query = `SELECT DISTINCT USR.UserId AS userId, USR.NumSchEnroll AS numberOfSchemsEnrolled, USR.FirstName AS firstName, 
    USR.LastName AS lastName, USR.Email AS email, USR.PanNumber AS panNumber, USR.Mobile AS mobile, 
    USR.Address AS address, BCH.Details AS branchDetails, BCH.Address AS branchAddress, 
    BCH.BranchId AS branchId , BCH.Name AS branchName , CUSR.Email AS createdByEmail, UUSR.Email AS updatedByEmail, 
    UserType.UserTypeId AS userTypeId , UserType.Title AS userTypeTitle
    FROM Users AS USR 
    LEFT JOIN Users AS CUSR ON USR.CreatedBy = CUSR.UserId
    LEFT JOIN Users AS UUSR ON USR.UpdatedBy = UUSR.UserId
    JOIN Branch AS BCH ON BCH.BranchId = USR.fk_BranchId
    JOIN UserType ON UserType.UserTypeId = USR.fk_UserTypeId 
    LEFT JOIN SchemeEnrollment ON SchemeEnrollment.fk_UserId = USR.UserId
    LEFT JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId
    WHERE ${whereCondition} ORDER BY USR.NumSchEnroll DESC LIMIT ${limit} OFFSET ${offset};
    SELECT COUNT(*) AS count FROM (
      SELECT DISTINCT USR.UserId AS userId
      FROM Users AS USR 
      LEFT JOIN Users AS CUSR ON USR.CreatedBy = CUSR.UserId
      LEFT JOIN Users AS UUSR ON USR.UpdatedBy = UUSR.UserId
      JOIN Branch AS BCH ON BCH.BranchId = USR.fk_BranchId
      JOIN UserType ON UserType.UserTypeId = USR.fk_UserTypeId 
      LEFT JOIN SchemeEnrollment ON SchemeEnrollment.fk_UserId = USR.UserId
      LEFT JOIN SchemeList ON SchemeList.SchemaId = SchemeEnrollment.fk_SchemaId
      WHERE ${whereCondition}) AS TBL`;
    return query;
  }
  public updateUser(
    userId,
    firstName,
    lastName,
    email,
    panNumber,
    mobile,
    address,
    branchId,
    userType,
    updatedUserId
  ) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let updateValue = "";

    if (updatedUserId) {
      updateValue += `UpdatedBy="${updatedUserId}"`;
    }

    if (firstName) {
      if (updateValue) {
        updateValue += `, FirstName="${firstName}"`;
      } else {
        updateValue += `FirstName="${firstName}"`;
      }
    }
    if (lastName) {
      if (updateValue) {
        updateValue += `, LastName="${lastName}"`;
      } else {
        updateValue = `LastName="${lastName}"`;
      }
    }
    if (email) {
      if (updateValue) {
        updateValue += `, Email="${email}"`;
      } else {
        updateValue += `Email="${email}"`;
      }
    }
    if (panNumber) {
      if (updateValue) {
        updateValue += `, PanNumber="${panNumber}"`;
      } else {
        updateValue += `PanNumber="${panNumber}"`;
      }
    }
    if (mobile) {
      if (updateValue) {
        updateValue += `, Mobile="${mobile}" `;
      } else {
        updateValue += `Mobile="${mobile}" `;
      }
    }
    if (address) {
      if (updateValue) {
        updateValue += `, Address="${address}"`;
      } else {
        updateValue += `Address="${address}"`;
      }
    }
    if (branchId) {
      if (updateValue) {
        updateValue += `, fk_BranchId="${branchId}"`;
      } else {
        updateValue += `fk_BranchId="${branchId}"`;
      }
    }
    if (userType) {
      if (updateValue) {
        updateValue += `, fk_UserTypeId="${userType}"`;
      } else {
        updateValue += `, fk_UserTypeId="${userType}"`;
      }
    }
    let query = `UPDATE Users SET ${updateValue} , UpdateUtc = '${updateUtc}' WHERE UserId = ${userId}`;
    return query;
  }
  public deleteUser(userId) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE Users SET IsActive = 0 , UpdateUtc = '${updateUtc}' WHERE UserId = ${userId};`;
    return query;
  }
  public mobileNumberCheck(mobileNumber) {
    return `SELECT Users.UserId, UserType.WebAccess, UserType.MobileAccess FROM Users
    JOIN UserType ON UserType.UserTypeId = Users.fk_UserTypeId  
    WHERE Mobile = '${mobileNumber}'`;
  }
  public getUserTypelist() {
    return `SELECT UserTypeId AS userTypeId, Title AS title, Alias AS alias 
    FROM UserType WHERE IsActive = 1;`;
  }
  public loginSessionInfo(sessionId, mobile) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE Users SET sessionId = "${sessionId}", UpdateUtc='${updateUtc}' 
    WHERE Mobile = '${mobile}';`;
    return query;
  }
  public getUserSessionId(mobile) {
    let query = `SELECT sessionId FROM Users WHERE Mobile = '${mobile}';`;
    return query;
  }
  public updateLastLogin(mobile) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE Users SET lastLoggedIn ='${updateUtc}', IsActive = 1, 
        UpdateUtc='${updateUtc}' WHERE Mobile  = '${mobile}';`;
    return query;
  }
  public updateUserIdAuthQuery(uuid, hash, userId) {
    let query = `UPDATE oAuth SET fk_UserId = '${userId}' WHERE UUID = UNHEX(REPLACE("${uuid}","-","")) 
      AND Hash = '${hash}'`;
    return query;
  }

  public getModuleAccessQuery(userId) {
    let query = `SELECT ModuleName AS moduleName,
    CASE WHEN CreateMode = 1 THEN 'true'
         WHEN CreateMode = 0 THEN 'false' 
    END AS createMode,
    CASE WHEN EditMode = 1 THEN 'true'
         WHEN EditMode = 0 THEN 'false' 
    END AS editMode,
    CASE WHEN ReadMode = 1 THEN 'true'
         WHEN ReadMode = 0 THEN 'false' 
    END AS readMode,
    CASE WHEN DeleteMode = 1 THEN 'true'
         WHEN DeleteMode = 0 THEN 'false' 
    END AS deleteMode FROM ModuleAccess 
    JOIN UserType ON UserType.UserTypeId = ModuleAccess.fk_UserTypeId
    JOIN Users ON Users.fk_UserTypeId = UserType.UserTypeId
    WHERE Users.UserId = '${userId}'`
    return query;
  }
}

export const queryhelper = new Queryhelper();
