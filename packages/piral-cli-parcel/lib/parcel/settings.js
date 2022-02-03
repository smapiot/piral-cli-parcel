"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendConfig = void 0;
const constants_1 = require("./constants");
function extendConfig(options) {
    return Object.assign({ cache: true, cacheDir: constants_1.defaultCacheDir, contentHash: false, scopeHoist: false, target: 'browser', logLevel: 3, hmrPort: 0, sourceMaps: true, detailedReport: true }, options);
}
exports.extendConfig = extendConfig;
//# sourceMappingURL=settings.js.map