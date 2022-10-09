import moment from "moment-timezone";
import { schemeEnrollment } from ".";
import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";

class Controler {
  public EnrollNewScheme(userId, schemeId) {
    return new Promise(async (resolve, reject) => {
      try {
        let checkUserIdAndSchemeQuery = queryhelper.checkUserIdAndSchemeId(
          userId,
          schemeId
        );
        let checkUserIdAndSchemeResponse = await Utility.databaseQuery(
          checkUserIdAndSchemeQuery,
          "Get Single User and Scheme"
        );
        let userInfo = checkUserIdAndSchemeResponse[0];
        let schemeInfo = checkUserIdAndSchemeResponse[1];
        let enrolledScheme = checkUserIdAndSchemeResponse[2];
        if (userInfo.length == 0 || schemeInfo.length == 0) {
          return resolve({
            status: "failure",
            message: "Invalid User Or Scheme!!!",
          });
        }
        if (enrolledScheme.length > 0) {
          let getFirstInstallmentNumberQuery = queryhelper.getFirstInstallmentNumber(enrolledScheme[0].EnrollmentId)
          let getFirstInstallmentNumberResponse = await Utility.databaseQuery(getFirstInstallmentNumberQuery, "Get First Installment Number Query")
          if (getFirstInstallmentNumberResponse.length > 0) {
            return resolve({
              status: "success",
              schemeEnrollmentId: enrolledScheme[0].EnrollmentId,
              installmentAmount: getFirstInstallmentNumberResponse[0].dueAmount,
              firstInstallmentId: getFirstInstallmentNumberResponse[0].firstInstallmentNumber,
              message: "User Enrolled To Scheme Successfully!!!",
            });
          }
          return resolve({
            status: "failure",
            message: "User Already Enrolled!!!",
          });
        }
        let remainingInstallments = 10;
        remainingInstallments = schemeInfo[0]?.Tenure;
        let dueAmount = schemeInfo[0]?.InstallmentAmount;
        let rateCardIdQuery = queryhelper.getRateCardId();
        let rateCardIdResponse = await Utility.databaseQuery(
          rateCardIdQuery,
          "Get Rate Card Query"
        );
        let rateCardId = 0;
        if (rateCardIdResponse.length > 0) {
          rateCardId = rateCardIdResponse[0].rateCardId;
        }
        let insertSchemeEnrollnmentQuery = queryhelper.insertSchemeEnrollnment(
          userId,
          schemeId,
          rateCardId,
          remainingInstallments,
          schemeInfo[0].Name,
          schemeInfo[0].Description,
          schemeInfo[0].InstallmentAmount
        );
        let enrollmentInfo = await Utility.databaseQuery(
          insertSchemeEnrollnmentQuery,
          "Create New SchemeEnrollment Query"
        );
        let ledgerQuery = queryhelper.insertLedgerInfo(
          remainingInstallments,
          enrollmentInfo.insertId,
          dueAmount
        );
        let installmentIds = await Utility.databaseQuery(ledgerQuery, "Insert Into Ledger Query");
        let firstInstallment = installmentIds[0].insertId
        let getTotalAmoutUserQuery =
          queryhelper.getTotalSchemeAndAmountPerScheme(schemeId, userId);
        let getTotalAmoutUserResponse = await Utility.databaseQuery(
          getTotalAmoutUserQuery,
          "Get sum of amount and users"
        );
        let userCount = getTotalAmoutUserResponse[0][0]?.count;
        let schemeCount = getTotalAmoutUserResponse[1][0]?.count;

        let updateNumUsersAndGrossAmount = queryhelper.updateNumUserSchemeCout(
          userCount,
          schemeCount,
          schemeId,
          userId
        );
        await Utility.databaseQuery(
          updateNumUsersAndGrossAmount,
          "Update Num of users and gross amount"
        );
        return resolve({
          status: "success",
          firstInstallmentId: firstInstallment,
          schemeEnrollmentId: enrollmentInfo.insertId,
          installmentAmount: schemeInfo[0].InstallmentAmount,
          message: "User Enrolled To Scheme Successfully!!!",
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In Enrollnewscheme method");
      }
    });
  }
  public getEnrolledSchemeList(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let getEnrolledSchemeListQuery = queryhelper.getEnrolledScheme(userId);
        let getEnrolledSchemeListWithCountResponse =
          await Utility.databaseQuery(
            getEnrolledSchemeListQuery,
            "Get Enrolled Scheme Query"
          );
        let enrolledSchemeList = getEnrolledSchemeListWithCountResponse[0];
        let totalCount = getEnrolledSchemeListWithCountResponse[1][0].Count;
        let schemeList = [];
        enrolledSchemeList.map((enrolledScheme) => {
          try {
            let singleScheme = {
              schemeEnrollmentId: enrolledScheme.schemeEnrollmentId,
              schemeName: enrolledScheme.schemeName,
              schemeDescription: enrolledScheme.schemeDescription,
              installmentAmount: enrolledScheme.installmentAmount,
              numberOfInstallment: enrolledScheme.numberOfInstallment,
              totalGoldAccumulated: enrolledScheme.totalGoldAccumulated,
              maturityAmount: enrolledScheme.maturityAmount,
              enrollDate: enrolledScheme.enrollDate,
              remainingInstallment: enrolledScheme.remainingInstallment,
              nextInstallmentDate: enrolledScheme.nextInstallmentDate,
              installments: [],
            };
            let singleIntallment = {
              dueAmount: enrolledScheme.dueAmount,
              isPaid: enrolledScheme.isPaid,
              dueDate: enrolledScheme.dueDate,
              installmentNumber: enrolledScheme.installmentNumber,
              mode: enrolledScheme.mode,
              paidDate: enrolledScheme.paidDate,
              goldAccumulated: enrolledScheme.goldAccumulated,
              installmentId: enrolledScheme.installmentId,
            };
            let found = false;
            schemeList = schemeList.map((singleSchemeList) => {
              if (
                singleSchemeList.schemeEnrollmentId ==
                enrolledScheme.schemeEnrollmentId
              ) {
                found = true;
                singleSchemeList.installments.push(singleIntallment);
              }
              return singleSchemeList;
            });
            if (!found) {
              singleScheme.installments.push(singleIntallment);
              schemeList.push(singleScheme);
            }
          } catch (error) { }
        });

        schemeList.sort((a: any, b: any) => {
          return new Date(a.nextInstallmentDate).valueOf() - new Date(b.nextInstallmentDate).valueOf()
        })
        return resolve({
          status: "success",
          enrolledSchemeList: schemeList,
          totalCount,
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In getEnrolledSchemeList");
      }
    });
  }

  public activateEnrolment(userId, schemeId, activate) {
    return new Promise(async (resolve, reject) => {
      try {
        let activeSchemeEnrolmentQuery = queryhelper.activeScheme(userId, schemeId, activate)
        Utility.databaseQuery(activeSchemeEnrolmentQuery, "Active Scheme Enrolment Query")
        if (activate == "true") {
          return resolve({ status: "success", message: "Enrollment is Activated!!!" })
        } else {
          return resolve({ status: "success", message: "Enrollment is deActivated!!!" })
        }
      } catch (error) {

      }
    })
  }
}

export const controller = new Controler();
