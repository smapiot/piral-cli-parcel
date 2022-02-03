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
function run(root, cacheDir, externals, importmap, targetDir, outFile, outDir, entryModule, logLevel, version, name) {
    return __awaiter(this, void 0, void 0, function* () {
        // using different environment variables requires clearing the cache
        yield (0, utils_1.removeDirectory)(cacheDir);
        (0, utils_1.setStandardEnvs)({
            production: true,
            root,
        });
        const bundler = (0, bundler_1.setupBundler)({
            type: 'dependency',
            externals,
            targetDir,
            entryModule,
            importmap,
            config: {
                outFile,
                outDir,
                cacheDir,
                watch: false,
                sourceMaps: true,
                minify: true,
                scopeHoist: false,
                contentHash: false,
                detailedReport: false,
                publicUrl: './',
                logLevel,
            },
        });
        const bundle = yield bundler.bundle();
        yield (0, bundler_1.postProcess)(bundle, name, version, true, importmap, true);
        return bundle.name;
    });
}
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    switch (msg.type) {
        case 'start':
            const outPath = yield run(process.cwd(), msg.cacheDir, msg.externals, msg.importmap, msg.targetDir, msg.outFile, msg.outDir, msg.entryModule, msg.logLevel, msg.version, msg.name).catch((error) => {
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
//# sourceMappingURL=run-build-dependency.js.map