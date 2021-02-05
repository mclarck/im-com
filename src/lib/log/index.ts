import moment = require("moment");

const Log = (message: any) => {
  if (typeof message === "string") {
    console.log(`[${moment().format("LLL")}] > ${message}`);
  } else {
    console.log(`[${moment().format("LLL")}] > ${JSON.stringify(message)}`);
    console.log(message);
  }
};

export default Log;
