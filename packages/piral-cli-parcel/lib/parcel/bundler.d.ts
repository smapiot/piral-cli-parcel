import * as Bundler from "parcel-bundler";
import type { PiletSchemaVersion, SharedDependency } from "piral-cli";
import { BundlerSetup } from "../types";
export declare function setupBundler(setup: BundlerSetup): Bundler;
export interface BundleSource {
    parent: Bundler.ParcelBundle;
    children: Set<Bundler.ParcelBundle>;
    src: string;
    css: string;
    map: string;
}
export declare function gatherJsBundles(bundle: Bundler.ParcelBundle, gatheredBundles?: Array<BundleSource>, parent?: Bundler.ParcelBundle): BundleSource[];
/**
 * Transforms a pilet's bundle to a microfrontend entry module.
 * @param bundle The bundle to transform.
 * @param name The name of the package for the chunk.
 * @param version The manifest version to create.
 * @param minified Determines if the bundle should be minified.
 * @param importmap The importmap for sharing dependencies.
 * @param isDependency Determines if the given bundle is a pilet or dependency.
 */
export declare function postProcess(bundle: Bundler.ParcelBundle, name: string, version: PiletSchemaVersion, minified: boolean, importmap: Array<SharedDependency>, isDependency?: boolean): Promise<string>;
