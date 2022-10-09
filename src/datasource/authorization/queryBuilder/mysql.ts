class Queryhelper {
  public insertNewAuthUUID(uuid, hash) {
    let query = `INSERT INTO oAuth(UUID, Hash, IsActive) VALUES (UNHEX(REPLACE("${uuid}","-","")),'${hash}',1)`;
    return query;
  }
  public checkAuthQuery(uuid, hash) {
    let query = `SELECT  UUID, IsActive, fk_UserId AS fkUserId FROM oAuth WHERE IsActive = 1 AND UUID = UNHEX(REPLACE("${uuid}","-","")) 
    AND Hash = '${hash}' AND InsertDate	>= DATE_SUB(NOW(), INTERVAL 480 MINUTE)`;
    return query;
  }
  public deactivateAuthQuery(uuid, hash) {
    let query = `UPDATE oAuth SET IsActive = 0 WHERE UUID = UNHEX(REPLACE("${uuid}","-","")) 
      AND Hash = '${hash}'`;
    return query;
  }
  public getUserType(userId) {
    let query = `SELECT UserType.WebAccess AS access FROM Users 
    JOIN UserType ON Users.fk_UserTypeId = UserType.UserTypeId WHERE Users.UserId = '${userId}'`;
    return query
  }
}

export const queryhelper = new Queryhelper();
