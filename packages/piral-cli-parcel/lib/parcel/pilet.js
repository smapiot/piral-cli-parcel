"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const bundler_1 = require("./bundler");
const bundler_run_1 = require("./bundler-run");
const handler = {
    create(options) {
        const bundler = (0, bundler_1.setupBundler)({
            type: 'pilet',
            externals: options.externals,
            importmap: options.importmap,
            targetDir: options.targetDir,
            entryModule: options.entryModule,
            config: {
                outFile: options.outFile,
                outDir: options.outDir,
                cacheDir: options.args.cacheDir,
                watch: options.watch,
                hmr: false,
                sourceMaps: options.sourceMaps,
                minify: options.minify,
                scopeHoist: options.args.scopeHoist,
                contentHash: !options.watch && options.contentHash,
                publicUrl: './',
                detailedReport: options.args.detailedReport,
                logLevel: options.logLevel,
                autoInstall: options.args.autoInstall,
            },
        });
        return (0, bundler_run_1.runParcel)(bundler, (bundle) => {
            const name = process.env.BUILD_PCKG_NAME;
            return (0, bundler_1.postProcess)(bundle, name, options.version, options.minify, options.importmap);
        });
    },
};
exports.create = handler.create;
//# sourceMappingURL=pilet.js.map