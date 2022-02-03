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
function run(root, piral, scopeHoist, emulator, sourceMaps, contentHash, detailedReport, minify, cacheDir, externals, publicUrl, outFile, outDir, entryFiles, logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        // using different environment variables requires clearing the cache
        yield (0, utils_1.removeDirectory)(cacheDir);
        (0, utils_1.setStandardEnvs)({
            production: !emulator,
            root,
            debugPiral: emulator,
            debugPilet: emulator,
            piral,
            dependencies: externals,
        });
        const bundler = (0, bundler_1.setupBundler)({
            type: 'piral',
            entryFiles,
            config: {
                cacheDir,
                watch: false,
                sourceMaps,
                contentHash,
                minify,
                scopeHoist,
                detailedReport,
                publicUrl,
                logLevel,
                outDir,
                outFile,
            },
        });
        const bundle = yield bundler.bundle();
        return bundle;
    });
}
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    switch (msg.type) {
        case 'start':
            const bundle = yield run(process.cwd(), msg.piral, msg.scopeHoist, msg.emulator, msg.sourceMaps, msg.contentHash, msg.detailedReport, msg.minify, msg.cacheDir, msg.externals, msg.publicUrl, msg.outFile, msg.outDir, msg.entryFiles, msg.logLevel).catch((error) => {
                process.send({
                    type: 'fail',
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            });
            if (bundle) {
                const [file] = (0, bundler_1.gatherJsBundles)(bundle);
                process.send({
                    type: 'done',
                    outDir: msg.outDir,
                    outFile: (0, path_1.relative)(msg.outDir, (file === null || file === void 0 ? void 0 : file.src) || msg.outDir),
                });
            }
            break;
    }
}));
//# sourceMappingURL=run-build-piral.js.map