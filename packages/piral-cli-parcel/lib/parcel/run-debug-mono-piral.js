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
const path_1 = require("path");
const utils_1 = require("piral-cli/utils");
const bundler_1 = require("./bundler");
const constants_1 = require("./constants");
function run(root, piral, externals, entryFiles, logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.progress)(`Preparing supplied Piral instance ...`);
        const outDir = (0, path_1.resolve)(root, 'dist', 'app');
        const cacheDir = (0, path_1.resolve)(root, constants_1.defaultCacheDir);
        (0, utils_1.setStandardEnvs)({
            piral,
            dependencies: externals,
            production: false,
            debugPiral: true,
            debugPilet: true,
            root,
        });
        const bundler = (0, bundler_1.setupBundler)({
            type: 'piral',
            entryFiles,
            config: {
                watch: true,
                minify: false,
                sourceMaps: true,
                contentHash: false,
                publicUrl: '/',
                logLevel,
                outDir,
                cacheDir,
                scopeHoist: false,
                hmr: false,
                autoInstall: false,
            },
        });
        const bundle = yield bundler.bundle();
        bundler.on('bundled', () => {
            (0, utils_1.log)('generalInfo_0000', `The Piral instance changed. Refresh your browser to get the latest changes.`);
        });
        (0, utils_1.logReset)();
        return bundle.name;
    });
}
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    switch (msg.type) {
        case 'start':
            const outPath = yield run(process.cwd(), msg.piral, msg.externals, msg.entryFiles, msg.logLevel).catch((error) => {
                process.send({
                    type: 'fail',
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            });
            if (outPath) {
                process.send({
                    type: 'done',
                    outDir: (0, path_1.dirname)(outPath),
                    outFile: (0, path_1.basename)(outPath),
                });
            }
            break;
    }
}));
//# sourceMappingURL=run-debug-mono-piral.js.map