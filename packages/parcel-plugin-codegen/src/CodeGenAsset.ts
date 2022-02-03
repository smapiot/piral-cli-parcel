import { Asset } from 'parcel-bundler';
import { readdirSync } from 'fs';
import { resolve } from 'path';

declare module 'parcel-bundler/index' {
  class Asset {
    constructor(name: string, options: any);
    addDependency(file: string, options?: { includedInParent?: boolean }): void;
  }
}

interface ModuleDefinition {
  type: string;
  value: string;
}

class CodeGenAsset extends Asset {
  private type: string;
  private content: string | Promise<string> | Promise<ModuleDefinition> | Array<ModuleDefinition>;

  constructor(name: string, options: any) {
    super(name, options);
    delete require.cache[require.resolve(name)];
    const generator = require(name);
    this.type = generator.type || 'js';
    this.content = generator.call(this);
  }

  getFiles(dir: string, filter?: (file: string) => boolean) {
    const files = readdirSync(dir)
      .map((m) => resolve(dir, m))
      .filter((m) => typeof filter !== 'function' || filter(m));

    files.forEach((file) => this.addDependency(file, { includedInParent: true }));

    return files;
  }

  load() {}

  toResult(value: string | Array<ModuleDefinition> | ModuleDefinition) {
    if (value && (Array.isArray(value) || typeof value === 'object')) {
      return value;
    } else if (typeof value === 'string') {
      return [
        {
          type: this.type,
          value,
        },
      ];
    }

    return [];
  }

  generate() {
    if (this.content instanceof Promise) {
      return this.content.then((value) => this.toResult(value));
    }

    return this.toResult(this.content);
  }
}

module.exports = CodeGenAsset;
