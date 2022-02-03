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
exports.postProcess = exports.gatherJsBundles = exports.setupBundler = void 0;
const Bundler = require("parcel-bundler");
const extendBundlerWithAtAlias = require("parcel-plugin-at-alias");
const extendBundlerWithCodegen = require("parcel-plugin-codegen");
const utils_1 = require("piral-cli/utils");
const utils_2 = require("parcel-plugin-externals/utils");
const source_map_1 = require("source-map");
const fs_1 = require("fs");
const path_1 = require("path");
const settings_1 = require("./settings");
let original;
function setupBundler(setup) {
    const proto = Bundler.prototype;
    if (!original) {
        original = proto.getLoadedAsset;
    }
    else {
        proto.getLoadedAsset = original;
    }
    switch (setup.type) {
        case "pilet": {
            const { entryModule, targetDir, externals, config, importmap } = setup;
            const deps = externals.concat(importmap.map((m) => m.name));
            const bundler = new Bundler(entryModule, (0, settings_1.extendConfig)(config));
            const resolver = (0, utils_2.combineExternals)(targetDir, [], deps, {});
            (0, utils_2.extendBundlerWithExternals)(bundler, resolver);
            extendBundlerWithAtAlias(bundler);
            extendBundlerWithCodegen(bundler);
            return bundler;
        }
        case "piral": {
            const { entryFiles, config } = setup;
            const bundler = new Bundler(entryFiles, (0, settings_1.extendConfig)(config));
            extendBundlerWithAtAlias(bundler);
            extendBundlerWithCodegen(bundler);
            return bundler;
        }
        case "dependency": {
            const { entryModule, targetDir, externals, config, importmap } = setup;
            const deps = externals.concat(importmap.map((m) => m.name));
            const bundler = new Bundler(entryModule, (0, settings_1.extendConfig)(config));
            const resolver = (0, utils_2.combineExternals)(targetDir, [], deps, {});
            (0, utils_2.extendBundlerWithExternals)(bundler, resolver);
            extendBundlerWithCodegen(bundler);
            return bundler;
        }
    }
}
exports.setupBundler = setupBundler;
function gatherJsBundles(bundle, gatheredBundles = [], parent = undefined) {
    if (bundle.type === "js") {
        const source = {
            parent,
            children: bundle.childBundles,
            src: bundle.name,
            css: undefined,
            map: undefined,
        };
        for (const childBundle of bundle.childBundles) {
            if (childBundle.name.endsWith(".js.map")) {
                source.map = childBundle.name;
            }
            else if (childBundle.name.endsWith(".css")) {
                source.css = childBundle.name;
            }
        }
        gatheredBundles.push(source);
    }
    for (const childBundle of bundle.childBundles) {
        gatherJsBundles(childBundle, gatheredBundles, bundle);
    }
    return gatheredBundles;
}
exports.gatherJsBundles = gatherJsBundles;
function gatherExternals(bundle, gatheredExternals = []) {
    if (bundle.type === "external") {
        const offset = 1;
        const length = ".external".length + offset;
        const assetName = bundle.entryAsset.name;
        const name = assetName.substr(offset, assetName.length - length);
        gatheredExternals.push(name);
    }
    for (const childBundle of bundle.childBundles) {
        gatherExternals(childBundle, gatheredExternals);
    }
    return gatheredExternals;
}
const bundleUrlRef = "__bundleUrl__";
const piletMarker = "//@pilet v:";
const preamble = `!(function(global,parcelRequire){'use strict';`;
const insertScript = `function define(getExports){(typeof document!=='undefined')&&(document.currentScript.app=getExports())};define.amd=true;`;
const getBundleUrl = `function(){try{throw new Error}catch(t){const e=(""+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,"$1")+"/"}return"/"}`;
const dynamicPublicPath = `var ${bundleUrlRef}=${getBundleUrl}();`;
const initializer = `${preamble}${dynamicPublicPath}`;
function isFile(bundleDir, name) {
    const path = (0, path_1.resolve)(bundleDir, name);
    return (0, fs_1.existsSync)(path) && (0, fs_1.statSync)(path).isFile();
}
function getScriptHead(version, prName, importmap) {
    switch (version) {
        case "none":
            return `\n${initializer}`;
        case "v0": // directEval
            return `${piletMarker}0\n${initializer}`;
        case "v1": // currentScript
            return `${piletMarker}1(${prName})\n${initializer}${insertScript}`;
        case "v2": // SystemJS
            return `${piletMarker}2(${prName},${JSON.stringify(importmap.reduce((obj, dep) => {
                obj[dep.id] = dep.ref;
                return obj;
            }, {}))})`;
        default:
            (0, utils_1.log)("invalidSchemaVersion_0171", version, ["v0", "v1", "v2"]);
            return getScriptHead("v0", prName, importmap);
    }
}
function readFileContent(src) {
    return new Promise((resolve, reject) => (0, fs_1.readFile)(src, "utf8", (err, data) => (err ? reject(err) : resolve(data))));
}
function writeFileContent(src, content) {
    return new Promise((resolve, reject) => (0, fs_1.writeFile)(src, content, "utf8", (err) => (err ? reject(err) : resolve())));
}
function applySourceMapShift(sourceFile, lineOffset = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFileContent(sourceFile);
        const incomingSourceMap = JSON.parse(content);
        // we need the await, because (in contrast to the d.ts), this may return a Promise!
        const consumer = yield new source_map_1.SourceMapConsumer(incomingSourceMap);
        const generator = new source_map_1.SourceMapGenerator({
            file: incomingSourceMap.file,
            sourceRoot: incomingSourceMap.sourceRoot,
        });
        consumer.eachMapping((m) => {
            // skip invalid (not-connected) mapping
            // refs: https://github.com/mozilla/source-map/blob/182f4459415de309667845af2b05716fcf9c59ad/lib/source-map-generator.js#L268-L275
            if (m.originalLine > 0 && m.originalColumn >= 0 && m.source) {
                generator.addMapping({
                    source: m.source,
                    name: m.name,
                    original: { line: m.originalLine, column: m.originalColumn },
                    generated: {
                        line: m.generatedLine + lineOffset,
                        column: m.generatedColumn,
                    },
                });
            }
        });
        const outgoingSourceMap = JSON.parse(generator.toString());
        outgoingSourceMap.sources = incomingSourceMap.sources;
        outgoingSourceMap.sourcesContent = incomingSourceMap.sourcesContent;
        return JSON.stringify(outgoingSourceMap);
    });
}
/**
 * Transforms a pilet's bundle to a microfrontend entry module.
 * @param bundle The bundle to transform.
 * @param name The name of the package for the chunk.
 * @param version The manifest version to create.
 * @param minified Determines if the bundle should be minified.
 * @param importmap The importmap for sharing dependencies.
 * @param isDependency Determines if the given bundle is a pilet or dependency.
 */
function postProcess(bundle, name, version, minified, importmap, isDependency = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const prName = `parcelChunkpr_${name.replace(/\W/gi, "")}`;
        const bundles = gatherJsBundles(bundle);
        const externals = gatherExternals(bundle);
        yield Promise.all(bundles.map(({ src, css, map, parent }) => __awaiter(this, void 0, void 0, function* () {
            const root = parent === undefined;
            const originalContent = yield readFileContent(src);
            const refAdjustedContent = replaceAssetRefs(src, originalContent);
            const adjustedContent = includeCssLink(css, refAdjustedContent, name);
            const details = {
                prName,
                version,
                externals,
                importmap,
                marker: undefined,
                head: "",
                map,
                minified,
                root,
            };
            if (!isDependency) {
                details.head = root
                    ? getScriptHead(version, prName, importmap)
                    : initializer;
                details.marker = root ? piletMarker : details.head;
            }
            const wrappedContent = yield wrapJsBundle(details, adjustedContent);
            yield writeFileContent(src, wrappedContent);
        })));
        return prName;
    });
}
exports.postProcess = postProcess;
function replaceAssetRefs(src, content) {
    const bundleDir = (0, path_1.dirname)(src);
    return content.replace(/^module\.exports\s?=\s?"(.*)";$/gm, (str, value) => {
        if (isFile(bundleDir, value)) {
            return str.replace(`"${value}"`, `${bundleUrlRef}+"${value}"`);
        }
        else {
            return str;
        }
    });
}
function includeCssLink(css, content, name) {
    /**
     * In pure JS bundles (i.e., we are not starting with an HTML file) Parcel
     * just omits the included CSS... This is bad (to say the least).
     * Here, we search for any sibling CSS bundles (there should be at most 1)
     * and include it asap using a standard approach.
     * Note: In the future we may allow users to disable this behavior (via a Piral
     * setting to disallow CSS inject).
     */
    if (css) {
        const cssName = (0, path_1.basename)(css);
        const debug = process.env.NODE_ENV === "development";
        const stylesheet = [
            `var d=document`,
            `var u=${bundleUrlRef}+${JSON.stringify(cssName)}`,
            `var e=d.createElement("link")`,
            `e.setAttribute('data-origin', ${JSON.stringify(name)})`,
            `e.type="text/css"`,
            `e.rel="stylesheet"`,
            `e.href=${debug ? 'u+"?_="+Math.random()' : "u"}`,
            `d.head.appendChild(e)`,
        ].join(";");
        /**
         * Only happens in debug mode:
         * Apply this only when the stylesheet is not yet part of the file.
         * This solves the edge case of touching files (i.e., saving without any change).
         * Here, Parcel triggers a re-build, but does not change the output files.
         * Making the change here would destroy the file.
         */
        if (content.indexOf(stylesheet) === -1) {
            return `(function(){${stylesheet}})();${content}`;
        }
    }
    return content;
}
function wrapJsBundle(details, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const { version, marker, root } = details;
        /**
         * Only happens in (pilet) debug mode:
         * Untouched bundles are not rewritten so we ignore them.
         */
        if (!content.startsWith(marker)) {
            switch (root && version) {
                case "v2":
                    return yield wrapSystemJs(details, content);
                default:
                    return yield wrapUmd(details, content);
            }
        }
        return content;
    });
}
/**
 * Transforms a pilet's bundle to an UMD entry module.
 */
function wrapUmd(details, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const { minified, map, prName, head } = details;
        const originalRequire = minified
            ? '"function"==typeof parcelRequire&&parcelRequire'
            : "typeof parcelRequire === 'function' && parcelRequire";
        /**
         * We perform quite some updates to the generated bundle.
         * We need to take care of aligning the .js.map file to these changes.
         */
        if (map) {
            const offset = head.split("\n").length;
            const result = yield applySourceMapShift(map, offset);
            yield writeFileContent(map, result);
        }
        /**
         * Wrap the JavaScript output bundle in an IIFE, fixing `global` and
         * `parcelRequire` declaration problems, and preventing `parcelRequire`
         * from leaking into global (window).
         * @see https://github.com/parcel-bundler/parcel/issues/1401
         */
        content = [
            head,
            content
                .split(originalRequire)
                .join(`"function"==typeof global.${prName}&&global.${prName}`),
        ].join("\n");
        const lines = content.split("\n");
        const sourceMapping = lines.pop();
        const hasSourceMaps = sourceMapping.indexOf("//# sourceMappingURL=") === 0;
        if (!hasSourceMaps) {
            lines.push(sourceMapping);
        }
        lines.push(`;global.${prName}=parcelRequire}(window, window.${prName}));`);
        if (hasSourceMaps) {
            lines.push(sourceMapping);
        }
        return lines.join("\n");
    });
}
function getRequireId(importmap, depName) {
    var _a, _b, _c;
    const dependency = importmap.find((i) => i.name === depName);
    return (_c = (_b = (_a = dependency) === null || _a === void 0 ? void 0 : _a.requireId) !== null && _b !== void 0 ? _b : dependency === null || dependency === void 0 ? void 0 : dependency.id) !== null && _c !== void 0 ? _c : depName;
}
/**
 * Transforms a pilet's bundle to a SystemJS entry module.
 */
function wrapSystemJs(details, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const { minified, map, prName, head, importmap, externals } = details;
        const dependencies = externals.map((depName) => getRequireId(importmap, depName));
        const originalRequire = minified
            ? '"function"==typeof parcelRequire&&parcelRequire'
            : "typeof parcelRequire === 'function' && parcelRequire";
        if (map) {
            const offset = head.split("\n").length + 3;
            const result = yield applySourceMapShift(map, offset);
            yield writeFileContent(map, result);
        }
        const lines = content
            .split(originalRequire)
            .join(`"function"==typeof global.${prName}&&global.${prName}`)
            .split("\n");
        const sourceMapping = lines.pop();
        const hasSourceMaps = sourceMapping.indexOf("//# sourceMappingURL=") === 0;
        if (!hasSourceMaps) {
            lines.push(sourceMapping);
        }
        const innerContent = lines.join("\n");
        const modDeps = JSON.stringify(dependencies);
        const init = externals.map((e) => `${JSON.stringify(e)}:{}`).join(",");
        const check = `var e=new Error("Cannot find module '"+n+"'");e.code='MODULE_NOT_FOUND';throw e`;
        const getters = `var _deps={${init}};var require=function(n){var d=_deps[n];if(!d){${check}} return d}`;
        const setters = externals
            .map((d) => `function(_dep){_deps[${JSON.stringify(d)}]=_dep}`)
            .join(",");
        const execute = `function(){var module={exports:{}};var exports=module.exports;
${initializer}${innerContent};global.${prName}=parcelRequire}(window,window.${prName}));
_export(module.exports);
}`;
        lines.splice(0, lines.length, `${head}
System.register(${modDeps},function(_export){${getters};return {
  setters:[${setters}],
  execute:${execute},
}});`);
        if (hasSourceMaps) {
            lines.push(sourceMapping);
        }
        return lines.join("\n");
    });
}
//# sourceMappingURL=bundler.js.map