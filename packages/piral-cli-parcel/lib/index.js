"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions = require("./actions");
const parcel_1 = require("./parcel");
const plugin = (cli) => {
    cli.withBundler('parcel', actions);
    Object.keys(parcel_1.standardPatches).forEach((key) => {
        cli.withPatcher(key, parcel_1.standardPatches[key]);
    });
};
module.exports = plugin;
//# sourceMappingURL=index.js.map