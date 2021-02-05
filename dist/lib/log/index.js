"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const Log = (message) => {
    if (typeof message === "string") {
        console.log(`[${moment().format("LLL")}] > ${message}`);
    }
    else {
        console.log(`[${moment().format("LLL")}] > ${JSON.stringify(message)}`);
        console.log(message);
    }
};
exports.default = Log;
//# sourceMappingURL=index.js.map