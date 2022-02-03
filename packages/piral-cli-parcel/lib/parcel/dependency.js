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
const bundler_1 = require("./bundler");
const bundler_run_1 = require("./bundler-run");
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (msg.type === 'start') {
            const bundler = (0, bundler_1.setupBundler)({
                type: 'dependency',
                externals: msg.externals,
                importmap: msg.importmap,
                targetDir: msg.targetDir,
                entryModule: msg.entryModule,
                config: {
                    outFile: msg.outFile,
                    outDir: msg.outDir,
                    cacheDir: msg.cacheDir,
                    watch: false,
                    sourceMaps: msg.sourceMaps,
                    minify: msg.minify,
                    scopeHoist: false,
                    contentHash: false,
                    detailedReport: false,
                    publicUrl: './',
                    logLevel: msg.logLevel,
                },
            });
            const handler = yield (0, bundler_run_1.runParcel)(bundler, (bundle) => {
                return (0, bundler_1.postProcess)(bundle, msg.name, msg.version, true, msg.importmap, true);
            });
            yield handler.bundle();
            process.send({
                type: 'done',
            });
        }
    }
    catch (error) {
        process.send({
            type: 'fail',
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
//# sourceMappingURL=dependency.js.map