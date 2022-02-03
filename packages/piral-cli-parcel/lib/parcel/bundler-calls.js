"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callStatic = exports.callDynamic = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
function getPath(name) {
    return (0, path_1.resolve)(__dirname, '..', '..', 'lib', 'parcel', `run-${name}.js`);
}
function createBundler(cwd, ps, args) {
    let promise = Promise.resolve();
    const listeners = [];
    const bundle = {
        dir: cwd,
        hash: '',
        name: '',
    };
    const setPending = () => {
        promise = new Promise((done) => {
            const f = () => {
                done();
                bundler.off(f);
            };
            bundler.on(f);
        });
    };
    const bundler = {
        bundle,
        start() {
            ps.send(Object.assign({ type: 'bundle' }, args));
        },
        on(cb) {
            listeners.push(cb);
        },
        off(cb) {
            listeners.splice(listeners.indexOf(cb), 1);
        },
        emit(args) {
            [...listeners].forEach((cb) => cb(args));
        },
        ready() {
            return promise;
        },
        setPending,
    };
    setPending();
    return bundler;
}
function callDynamic(name, args) {
    const cwd = args.root;
    return new Promise((resolve, reject) => {
        const ps = (0, child_process_1.fork)(getPath(name), [], { cwd });
        const bundler = createBundler(cwd, ps, args);
        ps.on('message', (msg) => {
            switch (msg.type) {
                case 'pending':
                    bundler.setPending();
                    break;
                case 'update':
                    bundler.bundle.hash = msg.outHash;
                    bundler.bundle.name = msg.outName;
                    bundler.emit(msg.args);
                    break;
                case 'done':
                    bundler.bundle.dir = msg.outDir;
                    return resolve(bundler);
                case 'fail':
                    return reject(msg.error);
            }
        });
        ps.send(Object.assign({ type: 'start' }, args));
    });
}
exports.callDynamic = callDynamic;
function callStatic(name, args) {
    const cwd = args.root;
    return new Promise((resolve, reject) => {
        const ps = (0, child_process_1.fork)(getPath(name), [], { cwd });
        const bundler = createBundler(cwd, ps, args);
        ps.on('message', (msg) => {
            switch (msg.type) {
                case 'done':
                    bundler.bundle.dir = msg.outDir;
                    bundler.bundle.name = msg.outFile;
                    return resolve(bundler);
                case 'fail':
                    return reject(msg.error);
            }
        });
        ps.send(Object.assign({ type: 'start' }, args));
    });
}
exports.callStatic = callStatic;
//# sourceMappingURL=bundler-calls.js.map