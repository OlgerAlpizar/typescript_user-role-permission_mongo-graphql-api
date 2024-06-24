"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (process.env.WHITE_LIST_URLS?.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true,
};
exports.default = corsOptions;
