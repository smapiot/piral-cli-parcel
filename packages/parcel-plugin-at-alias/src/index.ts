import type * as ParcelBundler from 'parcel-bundler';
import { resolve } from 'path';

function combineAliasFileName(aliases: Record<string, string>, file: string) {
  const aliasNames = Object.keys(aliases);
  const index = aliasNames.indexOf(file);

  if (index === -1) {
    const [hit] = aliasNames.filter((a) => file.startsWith(a + '/'));

    if (hit) {
      const root = aliases[hit];
      const path = file.replace(hit, '');
      return `${root}${path}`;
    }
  }

  return aliases[file];
}

interface GetAlias {
  (filename: string, dir: string, aliases: Record<string, string>): string;
}

let original: GetAlias;

export = function (bundler: ParcelBundler) {
  const resolver = (bundler as any).resolver;
  const getAlias = original || (original = resolver.__proto__.getAlias);

  resolver.__proto__.getAlias = function (filename: string, dir: string, aliases: Record<string, string>) {
    if (aliases && filename.startsWith('@')) {
      const alias = combineAliasFileName(aliases, filename);

      if (alias) {
        return resolve(dir, alias);
      }
    }

    return getAlias.call(resolver, filename, dir, aliases);
  };
};
