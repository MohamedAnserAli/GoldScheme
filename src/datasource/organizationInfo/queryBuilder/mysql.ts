class Queryhelper {

    public getOrganizationInfo() {
        let query = `SELECT Name AS name, Address AS address, PrimaryColor AS primaryColor 
        FROM OriganizationInformation`
        return query
    }

    public createOrganizationInfo(name, address) {
        let query = `INSERT INTO OriganizationInformation( Name, Address) VALUES ('${name}','${address}')`
        return query
    }
}

export const queryhelper = new Queryhelper();
