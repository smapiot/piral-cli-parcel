import type { BundleHandlerResponse } from 'piral-cli';
import type { ParcelBundle } from 'parcel-bundler';
export declare function runParcel(bundler: any, postProcess: (bundle: ParcelBundle) => Promise<string>): Promise<BundleHandlerResponse>;
