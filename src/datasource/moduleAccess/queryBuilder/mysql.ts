class Queryhelper {
    public getModuleAccess(userId, apiPath) {
        let query = `SELECT CreateMode, EditMode, ReadMode, DeleteMode FROM Users 
        JOIN UserType ON UserType.UserTypeId = Users.fk_UserTypeId 
        JOIN ModuleAccess ON Users.fk_UserTypeId = ModuleAccess.fk_UserTypeId 
        WHERE Users.UserId = ${userId} AND ModuleAccess.ModuleAccessAlias = "${apiPath}"`
        return query
    }
}

export const queryhelper = new Queryhelper();
