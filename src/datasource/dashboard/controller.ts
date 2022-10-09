import moment from "moment-timezone";
import { logger } from "../../log/logger";
import { Utility } from "../../utility/database/mysql/Utility";
import { queryhelper } from "./queryBuilder/mysql";
export let monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
class Controler {
  public getNewCustomerCount() {
    return new Promise(async (resolve, reject) => {
      try {
        let newCustomerCount = queryhelper.getMonthlyNewCustomer();
        let newCustomerCountResponse = await Utility.databaseQuery(
          newCustomerCount,
          "Get New Customer Count Query"
        );
        let delta = 0;
        let change = "Nil";
        let currentMonthNameMoment = moment().get("month") + 1;
        let updatedMonthList = [
          ...monthList.slice(currentMonthNameMoment),
          ...monthList.slice(0, currentMonthNameMoment),
        ];
        updatedMonthList = updatedMonthList.reverse();
        let currentMonthCode = newCustomerCountResponse[1][0]?.month
          ? newCustomerCountResponse[1][0]?.numMonth
          : -1;

        let metric = [];
        if (currentMonthCode != -1) {
          if (currentMonthNameMoment == currentMonthCode) {
            let currentMonthCount = newCustomerCountResponse[1][0]?.count
              ? newCustomerCountResponse[1][0].count
              : 0;
            let previousMonthCount = newCustomerCountResponse[1][1]?.count
              ? newCustomerCountResponse[1][1].count
              : 0;
            change = "increase";
            delta =
              currentMonthCount > 0
                ? (currentMonthCount - previousMonthCount) / currentMonthCount
                : 0;
            if (previousMonthCount > currentMonthCount) {
              change = "decrease";
              delta =
                previousMonthCount > 0
                  ? (previousMonthCount - currentMonthCount) /
                  previousMonthCount
                  : 0;
            }
            if (previousMonthCount == currentMonthCount) {
              change = "Nil";
            }
            metric = [
              ...newCustomerCountResponse[1].map((x) => {
                delete x.numMonth;
                return x;
              }),
            ];
          } else {
            metric = [
              ...newCustomerCountResponse[1].map((x) => {
                delete x.numMonth;
                return x;
              }),
            ];
          }
        }
        let addMetric = [];
        updatedMonthList.map((singleMonth) => {
          let found = false;
          let singleMetricValue = {};
          metric.map((singleMetric) => {
            if (singleMetric.month.toLowerCase() == singleMonth.toLowerCase()) {
              singleMetricValue = { ...singleMetric };
              found = true;
            }
          });
          if (found) {
            addMetric.push(singleMetricValue);
          } else {
            addMetric.push({
              count: 0,
              month: singleMonth,
            });
          }
        });
        metric = [...addMetric];
        let customerJson = {
          name: "New Customers",
          rate: {
            description: "compared to last month",
            value: Number((delta * 100).toFixed(2)),
            change,
          },
          count: newCustomerCountResponse[0][0]?.count,
          metric,
        };
        return resolve(customerJson);
      } catch (error) {
        logger.log("error", error);
        return reject("Error In getNewCustomerCount Method");
      }
    });
  }

  public getMonthlyPaidAmountPerScheme() {
    return new Promise(async (resolve, reject) => {
      try {
        let getMonthlyPaidAmountPerSchemeQuery =
          queryhelper.getMonthlyPaidAmountPerScheme();
        let getMonthlyPaidAmountPerSchemeResponse = await Utility.databaseQuery(
          getMonthlyPaidAmountPerSchemeQuery,
          "Get Monthly Paid Amount Per Scheme Query"
        );
        let currentMonthNameMoment = moment().get("month") + 1;
        let updatedMonthList = [
          ...monthList.slice(currentMonthNameMoment),
          ...monthList.slice(0, currentMonthNameMoment),
        ];
        updatedMonthList = updatedMonthList.reverse();
        let getMonthlyPaidAmountPerSchemeJson = {};
        let totalAmount =
          getMonthlyPaidAmountPerSchemeResponse[0][0]?.totalAmount;
        let addMetric = [];
        let metric = [...getMonthlyPaidAmountPerSchemeResponse[1]];
        updatedMonthList.map((singleMonth) => {
          let found = false;
          let singleMetricValue = {};
          metric.map((singleMetric) => {
            if (singleMetric.month.toLowerCase() == singleMonth.toLowerCase()) {
              singleMetricValue = { ...singleMetric };
              found = true;
            }
          });
          if (found) {
            addMetric.push(singleMetricValue);
          } else {
            addMetric.push({
              count: 0,
              month: singleMonth,
              amount: 0
            });
          }
        });
        metric = [...addMetric];
        let delta = 0;
        let change = "Nil";
        let currentMonthDate = metric[0];
        let previousMonthDate = metric[1];
        if (Number(previousMonthDate.amount) > Number(currentMonthDate.amount)) {
          change = "decrease";
          delta = Number(previousMonthDate.amount)
            ? (Number(previousMonthDate.amount) - Number(currentMonthDate.amount)) /
            Number(previousMonthDate.amount)
            : 0;
        }
        if (Number(previousMonthDate.amount) < Number(currentMonthDate.amount)) {
          change = "increase";
          delta = Number(currentMonthDate.amount)
            ? (Number(currentMonthDate.amount) - Number(previousMonthDate.amount)) /
            Number(previousMonthDate.amount)
            : 0;
        }
        let topPerformaingSchemeQuery = queryhelper.topPerformaingScheme(true);
        let topPerformingBranchQuery = queryhelper.topPerformingBranch(true);
        let topPerformaingBrancSchemeResponse = await Utility.databaseQuery(
          topPerformaingSchemeQuery + topPerformingBranchQuery,
          "Get Top performance Branch and scheme"
        );
        let topPerformingScheme = topPerformaingBrancSchemeResponse[0];
        let topPerformingBranch = topPerformaingBrancSchemeResponse[1];
        getMonthlyPaidAmountPerSchemeJson = {
          name: "Total Amount",
          topPerformingScheme: topPerformingScheme[0]?.schemeName,
          topPerformingBranch: topPerformingBranch[0]?.branchName,
          rate: {
            description: "compared to last month",
            value: Number((delta * 100).toFixed(2)),
            change,
          },
          totalAmount,
          metric,
        };

        return resolve(getMonthlyPaidAmountPerSchemeJson);
      } catch (error) {
        logger.log("error", error);
        return reject("Err in getMonthlyPaidAmountPerScheme Method");
      }
    });
  }

  public topPerformingBranchWithUsersAndPayment() {
    return new Promise(async (resolve, reject) => {
      try {
        let topPerformingBranchQuery = queryhelper.topPerformingBranch(false);
        let topPerformingBranchResponse = await Utility.databaseQuery(
          topPerformingBranchQuery,
          "Top Performing Branch Query"
        );
        let userEnrolledInTopPerformingBranchQuery = "";
        topPerformingBranchResponse.map((singleBranch) => {
          userEnrolledInTopPerformingBranchQuery +=
            queryhelper.userEnrolledInTopPerformingBranch(
              "fk_BranchId",
              singleBranch.branchId,
              "Users"
            );
        });
        if (!userEnrolledInTopPerformingBranchQuery) {
          return resolve({ status: "failure", message: "No Data!!!" })
        }
        let userEnrolledInTopPerformingBranchResponse =
          await Utility.databaseQuery(
            userEnrolledInTopPerformingBranchQuery,
            "Get User Enrollment For Top Performing Branch"
          );
        if (topPerformingBranchResponse.length == 1) {
          userEnrolledInTopPerformingBranchResponse = [userEnrolledInTopPerformingBranchResponse]
        }
        let branchInfo = [];
        topPerformingBranchResponse.map((singleBranch, index) => {
          let singleBranchJson = {};
          singleBranchJson["totalAmount"] = singleBranch.totalPaidAmount ? singleBranch.totalPaidAmount : 0;
          singleBranchJson["branchName"] = singleBranch.branchName;
          singleBranchJson["usersEnrolled"] =
            userEnrolledInTopPerformingBranchResponse[index][0]?.usersEnrolled
              ? userEnrolledInTopPerformingBranchResponse[index][0]
                ?.usersEnrolled
              : 0;
          branchInfo.push(singleBranchJson);
        });
        return resolve({
          status: "success",
          name: "Top Performing Branch",
          branchInfo,
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In Top Performing Branch With Users And Payment");
      }
    });
  }

  public topPerformingSchemeWithUsersAndPayment() {
    return new Promise(async (resolve, reject) => {
      try {
        let topPerformingSchemeQuery = queryhelper.topPerformaingScheme(false);
        let topPerformingSchemeResponse = await Utility.databaseQuery(
          topPerformingSchemeQuery,
          "Top Performing Scheme Query"
        );
        let PreviousTopPerformingSchemeQuery = queryhelper.topPerformaingScheme(
          false,
          true,
          topPerformingSchemeResponse[0]?.schemeId
        );
        let PreviousTopPerformingSchemeResponse = await Utility.databaseQuery(
          PreviousTopPerformingSchemeQuery,
          "Previous Top Performing Scheme Query"
        );
        let delta = 0;
        let change = "Nil";
        if (PreviousTopPerformingSchemeResponse.length > 0) {
          let previousMonthCount = PreviousTopPerformingSchemeResponse[0];
          let currentMonthCode = topPerformingSchemeResponse[0];
          if (
            previousMonthCount?.totalPaidAmount >
            currentMonthCode?.totalPaidAmount
          ) {
            delta = previousMonthCount?.totalPaidAmount
              ? (previousMonthCount?.totalPaidAmount -
                currentMonthCode?.totalPaidAmount) /
              previousMonthCount?.totalPaidAmount
              : 0;
            change = "decrease";
          }
          if (
            previousMonthCount?.totalPaidAmount <
            currentMonthCode?.totalPaidAmount
          ) {
            delta = previousMonthCount?.totalPaidAmount
              ? (currentMonthCode?.totalPaidAmount -
                previousMonthCount?.totalPaidAmount) /
              previousMonthCount?.totalPaidAmount
              : 0;
            change = "increase";
          }
        } else {
          delta = 1;
          change = "increase";
        }

        let topPerformingSchemeUserQuery = "";
        topPerformingSchemeResponse.map((singleScheme) => {
          topPerformingSchemeUserQuery +=
            queryhelper.userEnrolledInTopPerformingBranch(
              "fk_SchemaId",
              singleScheme.schemeId,
              "SchemeEnrollment"
            );
        });
        if (!topPerformingSchemeUserQuery) {
          return resolve({ status: "failure", message: "No Data!!!" })
        }
        let topPerformaingSchemeUserCount = await Utility.databaseQuery(
          topPerformingSchemeUserQuery,
          "Top Performing Scheme User count"
        );
        let schemeInfo = [];
        topPerformingSchemeResponse.map((singleScheme, index) => {
          let singleBranchJson = {};
          singleBranchJson["totalAmount"] = singleScheme.totalPaidAmount ? singleScheme.totalPaidAmount : 0;
          singleBranchJson["schemeName"] = singleScheme.schemeName;
          singleBranchJson["usersEnrolled"] = 0
          if (topPerformingSchemeResponse.length == 1) {
            singleBranchJson["usersEnrolled"] = topPerformaingSchemeUserCount[
              index
            ]?.usersEnrolled
              ? topPerformaingSchemeUserCount[index]?.usersEnrolled
              : 0;
          } else {
            singleBranchJson["usersEnrolled"] = topPerformaingSchemeUserCount[
              index
            ][0]?.usersEnrolled
              ? topPerformaingSchemeUserCount[index][0]?.usersEnrolled
              : 0;
          }

          schemeInfo.push(singleBranchJson);
        });
        let users = 0
        if (schemeInfo.length > 0) {
          users = schemeInfo[0].usersEnrolled
        }
        return resolve({
          status: "success",
          name: "Users",
          users,
          rate: {
            value: Number((delta * 100).toFixed(2)),
            change,
          },
          schemeInfo,
        });
      } catch (error) {
        console.log(error)
        logger.log("error", error);
        return reject("Error In topPerformingSchemeWithUsersAndPayment Method");
      }
    });
  }

  public missedInstallments() {
    return new Promise(async (resolve, reject) => {
      try {
        let missedInstallmentQuery = queryhelper.missedInstallmentsQuery();
        let missedInstallmentResponse = await Utility.databaseQuery(
          missedInstallmentQuery,
          "Get Missed Installment Query"
        );
        let currentMonthInstallment =
          missedInstallmentResponse[0][0]?.missedInstallmentAmount;
        let previousMonthInstallment =
          missedInstallmentResponse[1][0]?.missedInstallmentAmount;

        let delta = 0;
        let change = "Nil";
        if (Number(previousMonthInstallment) > currentMonthInstallment) {
          delta = Number(previousMonthInstallment)
            ? (Number(previousMonthInstallment) - currentMonthInstallment) /
            Number(previousMonthInstallment)
            : 0;
          change = "increase";
        }

        if (Number(previousMonthInstallment) < currentMonthInstallment) {
          delta = Number(currentMonthInstallment)
            ? (Number(currentMonthInstallment) -
              Number(previousMonthInstallment)) /
            Number(currentMonthInstallment)
            : 0;
          change = "decrease";
        }

        return resolve({
          status: "success",
          name: "Missed Installments",
          rate: {
            value: Number((delta * 100).toFixed(2)),
            change,
          },
          missedInstallmentAmount: currentMonthInstallment,
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In missedInstallments Method");
      }
    });
  }

  public redeemPerMonth() {
    return new Promise(async (resolve, reject) => {
      try {
        let lastMonthRedeemedAmountQuery =
          queryhelper.lastMonthRedeemedAmount();
        let lastMonthRedeemedAmountResponse = await Utility.databaseQuery(
          lastMonthRedeemedAmountQuery,
          "Get redeemed Per Month Query"
        );
        let lastMonthRedeemedAmount =
          lastMonthRedeemedAmountResponse[0]?.totalRedeemedAmount;
        let pendingRedeemAmountQuery = queryhelper.pendingRedeemAmount();
        let pendingRedeemAmountResponse = await Utility.databaseQuery(
          pendingRedeemAmountQuery,
          "Pending Redeem Amount Query"
        );

        let userCountQuery = queryhelper.notRedeemedUserCount()
        let userCountResponse =
          await Utility.databaseQuery(userCountQuery, "User Count Query")
        let userCount = 0
        if (userCountResponse.length > 0) {
          userCount = userCountResponse.pop().userCount
        }
        let currentMonthRedeemAmount =
          pendingRedeemAmountResponse[0]?.pendingRedeemAmount;
        let delta = 0;
        let change = "Nil";
        if (lastMonthRedeemedAmount > currentMonthRedeemAmount) {
          delta =
            (lastMonthRedeemedAmount - currentMonthRedeemAmount) /
            lastMonthRedeemedAmount;
          change = "decrease";
        }
        if (lastMonthRedeemedAmount < currentMonthRedeemAmount) {
          delta =
            (currentMonthRedeemAmount - lastMonthRedeemedAmount) /
            currentMonthRedeemAmount;
          change = "increase";
        }
        return resolve({
          status: "success",
          data: {
            name: "Not Redeemed Yet",
            rate: {
              value: Number((delta * 100).toFixed(2)),
              change,
            },
            userCount,
            notRedeemedAmount: currentMonthRedeemAmount,
          },
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error IN redeemPerMonth Method");
      }
    });
  }

  public expectedRedeemAmount() {
    return new Promise(async (resolve, reject) => {
      try {
        let lastMonthRedeemedAmountQuery =
          queryhelper.lastMonthRedeemedAmount();
        let lastMonthRedeemedAmountResponse = await Utility.databaseQuery(
          lastMonthRedeemedAmountQuery,
          "Get redeemed Per Month Query"
        );
        let lastMonthRedeemedAmount =
          lastMonthRedeemedAmountResponse[0]?.totalRedeemedAmount;
        let expectedredeemQuery = queryhelper.expectedRedeemAmount();
        let expectedredeemResponse = await Utility.databaseQuery(
          expectedredeemQuery,
          "Expected Redeem Query"
        );
        let expectedredeemAmount =
          expectedredeemResponse[0]?.pendingRedeemAmount;
        let userCountQuery = queryhelper.notRedeemedUserCount()
        let userCountResponse =
          await Utility.databaseQuery(userCountQuery, "User Count Query")
        let userCount = 0
        if (userCountResponse.length > 0) {
          userCount = userCountResponse.pop().userCount
        }
        let delta = 0;
        let change = "Nil";
        if (lastMonthRedeemedAmount > expectedredeemAmount) {
          delta =
            (lastMonthRedeemedAmount - expectedredeemAmount) /
            lastMonthRedeemedAmount;
          change = "decrease";
        }
        if (lastMonthRedeemedAmount < expectedredeemAmount) {
          delta =
            (expectedredeemAmount - lastMonthRedeemedAmount) /
            expectedredeemAmount;
          change = "increase";
        }
        return resolve({
          status: "success",
          data: {
            name: "Expected Redeem",
            userCount,
            rate: {
              value: Number((delta * 100).toFixed(2)),
              change,
            },
            expectedRedeemAmount: expectedredeemAmount,
          },
        });
      } catch (error) {
        logger.log("error", error);
        return reject("Error In Expeted Redeem Amount");
      }
    });
  }

  public getRedeemedUserPerMonth() {
    return new Promise(async (resolve, reject) => {
      try {
        let getRedeemedUserPerMonthQuery =
          queryhelper.getRedeemedUserPerMonth();
        let getRedeemedUserPerMonthResponse = await Utility.databaseQuery(
          getRedeemedUserPerMonthQuery,
          "Get Redeemed User PerMonth"
        );
        let currentMonthNameMoment = moment().get("month") + 1;
        let updatedMonthList = [
          ...monthList.slice(currentMonthNameMoment),
          ...monthList.slice(0, currentMonthNameMoment),
        ];
        updatedMonthList = updatedMonthList.reverse();
        let metric = [];
        let users = 0
        updatedMonthList.map((singleUpdatedMonth) => {
          let pushed = false;
          getRedeemedUserPerMonthResponse.map((singleRedeemUser) => {
            if (
              singleRedeemUser.month.toLowerCase() ==
              singleUpdatedMonth.toLowerCase()
            ) {
              pushed = true;
              delete singleRedeemUser.userId;
              users += singleRedeemUser.count
              metric.push(singleRedeemUser);
            }
          });
          if (!pushed) {
            metric.push({
              count: 0,
              month: singleUpdatedMonth,
            });
          }
        });

        let delta = 0;
        let change = "Nil";

        let currentMonthValue = metric[0];
        let previousMonthValue = metric[1];

        if (previousMonthValue.count > currentMonthValue.count) {
          delta =
            (previousMonthValue.count - currentMonthValue.count) /
            previousMonthValue.count;
          change = "decrease";
        }
        if (previousMonthValue.count < currentMonthValue.count) {
          delta =
            (currentMonthValue.count - previousMonthValue.count) /
            currentMonthValue.count;
          change = "increase";
        }
        let finalResponse = {
          name: "Redeemed Users",
          users,
          rate: {
            change,
            value: Number((delta * 100).toFixed(2)),
          },
          metric,
        };

        return resolve(finalResponse);
      } catch (error) {
        logger.log("error", error);
        return reject("Error In getRedeemedUserPerMonth Method");
      }
    });
  }

  public totalTopPerformingScheme() {
    return new Promise(async (resolve, reject) => {
      try {
        let topPerformingSchemeQuery = queryhelper.totalTopPerformingScheme()
        let topPerformingSchemeResponse =
          await Utility.databaseQuery(topPerformingSchemeQuery, "Top Performing Scheme Query")
        if (topPerformingSchemeResponse.length == 0) {
          return resolve({ status: "failure", message: "No Data!!!" })
        }
        let totalCustomers = 0
        topPerformingSchemeResponse.map(singleTopPerformingSchemeResponse => {
          totalCustomers += Number(singleTopPerformingSchemeResponse?.usersEnrolled)
        })
        return resolve({
          status: "success",
          name: "Total Customers",
          users: totalCustomers,
          rate: {
            value: 0,
            change: "increase"
          },
          schemeInfo: topPerformingSchemeResponse
        })
      } catch (error) {
        logger.log("error", error)
        return reject(error)
      }
    })
  }

  public totalTopPerformingBranch() {
    return new Promise(async (resolve, reject) => {
      try {
        let totalTopPerformingBranchQuery = queryhelper.totalTopPerformingBranch()
        let topPerformingBranch =
          await Utility.databaseQuery(totalTopPerformingBranchQuery, "Total Top Performing Branch Query")
        if (topPerformingBranch.length == 0) {
          return resolve({ status: "failure", message: "No Data!!!" })
        }
        return resolve({
          status: "success",
          name: "Top Performing Branch",
          branchInfo: topPerformingBranch
        })
      } catch (error) {
        logger.log("error", error)
        return reject(error)
      }
    })
  }

  public totalMissedInstallments() {
    return new Promise(async (resolve, reject) => {
      try {
        let totalMissedInstallmentsQuery = queryhelper.totalMissedInstallments()
        let totalMissedInstallmentsResponse =
          await Utility.databaseQuery(totalMissedInstallmentsQuery, "Total Missed Installments Query")
        return resolve({
          status: "status",
          name: "Missed Installments",
          rate: {
            change: "increase",
            value: 0
          },
          missedInstallmentAmount: totalMissedInstallmentsResponse.pop()["missedInstallmentAmount"]
        })
      } catch (error) {
        logger.log("error", error)
        return reject(error)
      }
    })
  }
}

export const controller = new Controler();
