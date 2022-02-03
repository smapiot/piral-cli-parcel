"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const bundler_1 = require("./bundler");
const bundler_run_1 = require("./bundler-run");
const handler = {
    create(options) {
        const bundler = (0, bundler_1.setupBundler)({
            type: 'piral',
            entryFiles: options.entryFiles,
            config: {
                cacheDir: options.args.cacheDir,
                watch: options.watch,
                sourceMaps: options.sourceMaps,
                contentHash: !options.watch && options.contentHash,
                minify: options.minify,
                scopeHoist: options.args.scopeHoist,
                detailedReport: options.args.detailedReport,
                publicUrl: options.publicUrl,
                logLevel: options.logLevel,
                outDir: options.outDir,
                outFile: options.outFile,
                hmr: options.hmr,
                autoInstall: options.args.autoInstall,
            },
        });
        return (0, bundler_run_1.runParcel)(bundler, () => Promise.resolve(''));
    },
};
exports.create = handler.create;
//# sourceMappingURL=piral.js.map