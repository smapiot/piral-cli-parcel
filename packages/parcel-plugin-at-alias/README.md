# parcel-plugin-at-alias

[![Build Status](https://florianrappl.visualstudio.com/parcel-plugin-at-alias/_apis/build/status/FlorianRappl.parcel-plugin-at-alias?branchName=master)](https://florianrappl.visualstudio.com/parcel-plugin-at-alias/_build/latest?definitionId=26&branchName=master)
[![npm](https://img.shields.io/npm/v/parcel-plugin-at-alias.svg)](https://www.npmjs.com/package/parcel-plugin-at-alias)
[![GitHub tag](https://img.shields.io/github/tag/FlorianRappl/parcel-plugin-at-alias.svg)](https://github.com/FlorianRappl/parcel-plugin-at-alias/releases)
[![GitHub issues](https://img.shields.io/github/issues/FlorianRappl/parcel-plugin-at-alias.svg)](https://github.com/FlorianRappl/parcel-plugin-at-alias/issues)

Parcel plugin to provide support for '@'-prefixed aliases. :package:

## Usage

Just install the plugin, e.g.,

```sh
npm i parcel-plugin-at-alias
```

and use `alias` sections as specified in the [Parcel documentation](https://parceljs.org/module_resolution.html#aliases).

The difference with this plugin is that aliases prefixed with `@` just work.

Example:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "devDependencies": {
    "parcel-bundler": "1.x",
    "parcel-plugin-at-alias": "latest",
  },
  "alias": {
    "@types": "./src/types"
  }
}
```

Now in some module you can write:

```js
import { Foo } from '@types/foo';

// do something with Foo, which comes from './src/types/foo'
```

By default, you can either append paths to your aliases, or use it directly, such as `import '@types'`.

**Question**: Why is this useful?

Usually, if you start a greenfield project using Parcel you'd know what it *can* and what it *cannot* do. So for a greenfield approach there is potentially no need for this plugin, unless there is a specific requirement to implement `@`-prefixed aliases.

There are, however, projects that would like to migrate to Parcel, however, cannot do that due to this limitation. There would be just too many changes. We've had such projects in the past and given that the `@`-prefixed aliases are seen quite often in projects (using Webpack) we'd love to have this support in Parcel, too.

**Question**: Are there side-effects?

There shouldn't be any. Actually, I don't know why `@`-prefixed aliases have been disallowed. Of course, it could make lazy / auto installation of scoped modules less reliable, but given that you'd still need to have an explicit `@`-prefixed alias that collides here I don't see that as a problem.

Nevertheless, if you encounter some strange behavior then just create an issue with a [MWE](https://en.wikipedia.org/wiki/Minimal_working_example) to reproduce and fix and the problem.

## Changelog

This project adheres to [semantic versioning](https://semver.org).

You can find the changelog in the [CHANGELOG.md](CHANGELOG.md) file.

## License

This plugin is released using the MIT license. For more information see the [LICENSE file](LICENSE).
