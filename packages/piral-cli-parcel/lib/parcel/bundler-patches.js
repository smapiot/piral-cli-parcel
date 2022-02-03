"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardPatches = void 0;
const path_1 = require("path");
const utils_1 = require("piral-cli/utils");
const windowOrGlobal = '(typeof window !== "undefined" ? window : global)';
function replaceAll(dir, file, original, replacement) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield (0, utils_1.readText)(dir, file);
        if (content && content.indexOf(original) !== -1) {
            yield (0, utils_1.writeText)(dir, file, content.split(original).join(replacement));
        }
    });
}
exports.standardPatches = {
    buffer(rootDir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield replaceAll(rootDir, 'index.js', ' global.', ` ${windowOrGlobal}.`);
        });
    },
    'has-symbols'(rootDir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield replaceAll(rootDir, 'index.js', ' global.', ` ${windowOrGlobal}.`);
        });
    },
    ketting(rootDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const util = (0, path_1.resolve)(rootDir, 'dist', 'util');
            const utils = (0, path_1.resolve)(rootDir, 'dist', 'utils');
            yield replaceAll(util, 'fetch-helper.js', 'global', windowOrGlobal);
            yield replaceAll(utils, 'fetch-helper.js', 'global', windowOrGlobal);
            yield replaceAll(utils, 'fetch-polyfill.js', 'global', windowOrGlobal);
        });
    },
};
//# sourceMappingURL=bundler-patches.js.map