export declare const create: (config: {
    root: string;
    piral: string;
    entryModule: string;
    targetDir: string;
    outDir: string;
    outFile: string;
    externals: string[];
    importmap: import("piral-cli").SharedDependency[];
    version: import("piral-cli").PiletSchemaVersion;
    develop: boolean;
    sourceMaps: boolean;
    contentHash: boolean;
    minify: boolean;
    logLevel: import("piral-cli").LogLevels;
    watch: boolean;
    args: any;
}) => Promise<import("piral-cli").BundleHandlerResponse>;
