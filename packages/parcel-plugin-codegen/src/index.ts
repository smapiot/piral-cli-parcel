import type * as ParcelBundler from 'parcel-bundler';

export = function (bundler: ParcelBundler) {
  bundler.addAssetType('codegen', require.resolve('./CodeGenAsset'));
};
