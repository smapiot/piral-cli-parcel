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
exports.runParcel = void 0;
const events_1 = require("events");
const path_1 = require("path");
function runParcel(bundler, postProcess) {
    const eventEmitter = new events_1.EventEmitter();
    const result = {
        outFile: '',
        outDir: bundler.options.outDir,
        name: '',
        hash: '',
        requireRef: undefined,
    };
    const update = (bundle) => __awaiter(this, void 0, void 0, function* () {
        const requireRef = yield postProcess(bundle);
        const file = bundler.mainBundle.name;
        result.hash = bundler.mainBundle.entryAsset.hash;
        result.name = (0, path_1.basename)(file);
        result.outDir = (0, path_1.dirname)(file);
        result.outFile = `/${(0, path_1.basename)(file)}`;
        result.requireRef = requireRef;
    });
    bundler.on('buildStart', () => eventEmitter.emit('start'));
    bundler.on('bundled', (bundle) => __awaiter(this, void 0, void 0, function* () {
        yield update(bundle);
        eventEmitter.emit('end', result);
    }));
    return Promise.resolve({
        bundle() {
            return __awaiter(this, void 0, void 0, function* () {
                const bundle = yield bundler.bundle();
                yield update(bundle);
                return result;
            });
        },
        onStart(cb) {
            eventEmitter.on('start', cb);
        },
        onEnd(cb) {
            eventEmitter.on('end', cb);
        },
    });
}
exports.runParcel = runParcel;
//# sourceMappingURL=bundler-run.js.map