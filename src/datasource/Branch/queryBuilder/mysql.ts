import moment from "moment";

class Queryhelper {
  public insertNewBranch(name, address, details = null) {
    let queryKey = ""
    let queryValue = ""
    if (details) {
      queryKey = ", Details"
      queryValue = `,'${details}'`
    }
    let query = `INSERT INTO Branch(Name, Address${queryKey}) 
    VALUES ('${name}','${address}'${queryValue});`;
    return query;
  }

  public updateBranch(branchId, name, address, details) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let updateValue = "";
    if (name) {
      if (updateValue) {
        updateValue += `, Name="${name}"`;
      } else {
        updateValue = `Name="${name}"`;
      }
    }
    if (address) {
      if (updateValue) {
        updateValue += `, Address="${address}"`;
      } else {
        updateValue = `Address="${address}"`;
      }
    }
    if (details) {
      if (updateValue) {
        updateValue += `, Details="${details}"`;
      } else {
        updateValue = `Details="${details}"`;
      }
    }
    let query = `UPDATE Branch SET ${updateValue} ,UpdateUtc='${updateUtc}' WHERE BranchId = ${branchId}`;
    return query;
  }

  public getBranches(fromDate = "", toDate = "", branchId = "", search = "") {
    let whereCondition = "";
    if (branchId) {
      whereCondition += `AND Branch.BranchId = ${branchId}`;
    }
    if (fromDate && toDate && !branchId) {
      whereCondition += `AND Branch.InsertUtc >= '${fromDate}' AND Branch.InsertUtc <= '${toDate}'`;
    }
    if (search) {
      whereCondition += ` AND (Branch.Name LIKE '%${search}%')`;
    }
    let query = `SELECT  SchemeList.SchemaId AS schemeId,SchemeList.Name AS schemeName, 
    Branch.BranchId AS branchId, Branch.Name AS name, Branch.Address AS address, 
    Branch.Details AS details FROM Branch
    LEFT JOIN BranchSchameEnrollment ON BranchSchameEnrollment.fk_branchId = Branch.BranchId
    LEFT JOIN SchemeList ON BranchSchameEnrollment.fk_schemeId = SchemeList.SchemaId 
    WHERE Branch.IsActive = 1 ${whereCondition} ORDER BY Branch.InsertUtc DESC;
    SELECT COUNT(*) AS Count 
    FROM Branch 
    LEFT JOIN BranchSchameEnrollment ON BranchSchameEnrollment.fk_branchId = Branch.BranchId
    LEFT JOIN SchemeList ON BranchSchameEnrollment.fk_schemeId = SchemeList.SchemaId 
    WHERE Branch.IsActive = 1 ${whereCondition} ORDER BY Branch.InsertUtc DESC`;
    return query;
  }

  public deleteBranch(branchId) {
    let updateUtc = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let query = `UPDATE Branch SET IsActive = 0 , UpdateUtc = '${updateUtc}' WHERE BranchId = ${branchId};`;
    return query;
  }

  public insertAssocaitedSchemeToBranch(branchId, schemeId) {
    let query = `INSERT INTO BranchSchameEnrollment(fk_branchId, fk_schemeId) VALUES ('${branchId}','${schemeId}');`;
    return query;
  }

  public checkBrancAndScheme(schemeId) {
    let query = `SELECT SchemaId AS SI FROM SchemeList WHERE SchemaId = '${schemeId}' AND IsActive = 1;
    `;
    return query;
  }

  public deleteBranchScheme(branchId, schemeId) {
    let query = `UPDATE BranchSchameEnrollment SET IsActive = 0  
    WHERE fk_branchId = '${branchId}' AND fk_schemeId = '${schemeId}';`;
    return query;
  }
}

export const queryhelper = new Queryhelper();
