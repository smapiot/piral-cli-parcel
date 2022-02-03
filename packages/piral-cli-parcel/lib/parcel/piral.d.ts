export declare const create: (config: {
    root: string;
    entryFiles: string;
    outDir: string;
    outFile: string;
    externals: string[];
    emulator: boolean;
    sourceMaps: boolean;
    contentHash: boolean;
    minify: boolean;
    publicUrl: string;
    hmr: boolean;
    logLevel: import("piral-cli").LogLevels;
    watch: boolean;
    args: any;
}) => Promise<import("piral-cli").BundleHandlerResponse>;
