import { Bundler, BaseBundleParameters } from 'piral-cli';
export declare function callDynamic<T extends BaseBundleParameters>(name: string, args: T): Promise<Bundler>;
export declare function callStatic<T extends BaseBundleParameters>(name: string, args: T): Promise<Bundler>;
