import axios from "axios";
import { environment } from "../../environment/environment";
import { logger } from "../../log/logger";

class Provider {
  public callOTPService(phoneNumber) {
    return new Promise(async (resolve, reject) => {
      try {
        let { data } = await axios({
          method: "get",
          url: `https://2factor.in/API/V1/${environment.apiKeyTwoFactor}/SMS/${phoneNumber}/AUTOGEN`,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        });
        return resolve(data.Details);
      } catch (error) {
        logger.log("error", error);
        return reject(error);
      }
    });
  }
  public verifyOtpService(sessionId, otpInput) {
    return new Promise(async (resolve, reject) => {
      try {
        let { data } = await axios({
          method: "get",
          url: `https://2factor.in/API/V1/${environment.apiKeyTwoFactor}/SMS/VERIFY/${sessionId}/${otpInput}`,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        });
        return resolve(data);
      } catch (error) {
        logger.log("error", error);
        return resolve({
          status: "failure",
          message: "OTP MisMatch !!!",
        });
      }
    });
  }
}

export const provider = new Provider();
