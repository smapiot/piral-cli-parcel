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
const utils_1 = require("piral-cli/utils");
const bundler_1 = require("./bundler");
function run(root, piral, scopeHoist, autoInstall, hmr, cacheDir, externals, publicUrl, entryFiles, logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.setStandardEnvs)({
            root,
            debugPiral: true,
            dependencies: externals,
            piral,
        });
        const bundler = (0, bundler_1.setupBundler)({
            type: 'piral',
            entryFiles,
            config: {
                publicUrl,
                logLevel,
                cacheDir,
                scopeHoist,
                hmr,
                autoInstall,
            },
        });
        return bundler;
    });
}
let bundler;
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const root = process.cwd();
    switch (msg.type) {
        case 'bundle':
            if (bundler) {
                yield bundler.bundle();
                bundler.on('buildStart', () => {
                    process.send({
                        type: 'pending',
                    });
                });
            }
            break;
        case 'start':
            bundler = yield run(root, msg.piral, msg.scopeHoist, msg.autoInstall, msg.hmr, msg.cacheDir, msg.externals, msg.publicUrl, msg.entryFiles, msg.logLevel).catch((error) => {
                process.send({
                    type: 'fail',
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            });
            if (bundler) {
                bundler.on('bundled', () => {
                    process.send({
                        type: 'update',
                        outHash: bundler.mainBundle.entryAsset.hash,
                        outName: bundler.mainBundle.name.substr(bundler.options.outDir.length + 1),
                        args: {
                            root,
                        },
                    });
                });
                process.send({
                    type: 'done',
                    outDir: bundler.options.outDir,
                });
            }
            break;
    }
}));
//# sourceMappingURL=run-debug-piral.js.map