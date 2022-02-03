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
exports.buildPilet = exports.debugPilet = exports.buildPiral = exports.watchPiral = exports.debugPiral = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
const utils_1 = require("piral-cli/utils");
const parcel_1 = require("./parcel");
function buildDependencies(args, cacheDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = (0, path_1.resolve)(__dirname, 'parcel', `dependency.js`);
        const cwd = process.cwd();
        for (const dependency of args.importmap) {
            if (dependency.type === 'local') {
                yield new Promise((resolve, reject) => {
                    const ps = (0, child_process_1.fork)(path, [], { cwd });
                    ps.on('message', (msg) => {
                        switch (msg.type) {
                            case 'done':
                                return resolve();
                            case 'fail':
                                return reject(msg.error);
                        }
                    });
                    ps.send(Object.assign(Object.assign({ type: 'start' }, args), { name: dependency.id, optimizeModules: false, outFile: dependency.ref, entryModule: dependency.entry, importmap: args.importmap.filter((m) => m !== dependency), _: {}, cacheDir }));
                });
            }
        }
    });
}
exports.debugPiral = {
    flags(argv) {
        return argv
            .boolean('fresh')
            .describe('fresh', 'Resets the cache before starting the debug mode.')
            .default('fresh', false)
            .string('cache-dir')
            .describe('cache-dir', 'Sets the cache directory for bundling.')
            .default('cache-dir', parcel_1.defaultCacheDir)
            .boolean('scope-hoist')
            .describe('scope-hoist', 'Tries to reduce bundle size by introducing tree shaking.')
            .default('scope-hoist', false)
            .boolean('autoinstall')
            .describe('autoinstall', 'Automatically installs missing Node.js packages.')
            .default('autoinstall', true);
    },
    path: (0, path_1.resolve)(__dirname, 'parcel', 'piral.js'),
    prepare(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cacheDir = parcel_1.defaultCacheDir, scopeHoist = false, autoInstall = true, fresh = false } = args._;
            const cache = (0, path_1.resolve)(args.root, cacheDir);
            if (fresh) {
                yield (0, utils_1.removeDirectory)(cache);
            }
            return Object.assign(Object.assign({}, args), { _: {}, cacheDir: cache, scopeHoist,
                autoInstall });
        });
    },
};
exports.watchPiral = {
    path: (0, path_1.resolve)(__dirname, 'parcel', 'piral.js'),
};
exports.buildPiral = {
    flags(argv) {
        return argv
            .string('cache-dir')
            .describe('cache-dir', 'Sets the cache directory for bundling.')
            .default('cache-dir', parcel_1.defaultCacheDir)
            .boolean('detailed-report')
            .describe('detailed-report', 'Sets if a detailed report should be created.')
            .default('detailed-report', false)
            .boolean('scope-hoist')
            .describe('scope-hoist', 'Tries to reduce bundle size by introducing tree shaking.')
            .default('scope-hoist', false);
    },
    path: (0, path_1.resolve)(__dirname, 'parcel', 'piral.js'),
    prepare(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { detailedReport = false, scopeHoist = false, cacheDir = parcel_1.defaultCacheDir } = args._;
            const cache = (0, path_1.resolve)(args.root, cacheDir);
            yield (0, utils_1.removeDirectory)(cache);
            return Object.assign(Object.assign({}, args), { _: {}, cacheDir: cache, detailedReport,
                scopeHoist });
        });
    },
};
exports.debugPilet = {
    flags(argv) {
        return argv
            .string('cache-dir')
            .describe('cache-dir', 'Sets the cache directory for bundling.')
            .default('cache-dir', parcel_1.defaultCacheDir)
            .boolean('fresh')
            .describe('fresh', 'Resets the cache before starting the debug mode.')
            .default('fresh', false)
            .boolean('scope-hoist')
            .describe('scope-hoist', 'Tries to reduce bundle size by introducing tree shaking.')
            .default('scope-hoist', false)
            .boolean('autoinstall')
            .describe('autoinstall', 'Automatically installs missing Node.js packages.')
            .default('autoinstall', true);
    },
    path: (0, path_1.resolve)(__dirname, 'parcel', 'pilet.js'),
    prepare(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cacheDir = parcel_1.defaultCacheDir, scopeHoist = false, autoInstall = true, fresh = false } = args._;
            const cache = (0, path_1.resolve)(args.root, cacheDir);
            if (fresh) {
                yield (0, utils_1.removeDirectory)(cache);
            }
            const options = Object.assign(Object.assign({}, args), { _: {}, cacheDir: cache, scopeHoist,
                autoInstall });
            yield buildDependencies(options, cacheDir);
            return options;
        });
    },
};
exports.buildPilet = {
    flags(argv) {
        return argv
            .string('cache-dir')
            .describe('cache-dir', 'Sets the cache directory for bundling.')
            .default('cache-dir', parcel_1.defaultCacheDir)
            .boolean('detailed-report')
            .describe('detailed-report', 'Sets if a detailed report should be created.')
            .default('detailed-report', false)
            .boolean('scope-hoist')
            .describe('scope-hoist', 'Tries to reduce bundle size by introducing tree shaking.')
            .default('scope-hoist', false);
    },
    path: (0, path_1.resolve)(__dirname, 'parcel', 'pilet.js'),
    prepare(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { detailedReport = false, cacheDir = parcel_1.defaultCacheDir, scopeHoist = false } = args._;
            const cache = (0, path_1.resolve)(args.root, cacheDir);
            yield (0, utils_1.removeDirectory)(cache);
            const options = Object.assign(Object.assign({}, args), { _: {}, cacheDir: cache, detailedReport,
                scopeHoist });
            yield buildDependencies(options, cacheDir);
            return options;
        });
    },
};
//# sourceMappingURL=actions.js.map