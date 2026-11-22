import * as fs from 'fs';
import * as path from 'path';

interface PackageManifest {
  dependencies: Record<string, string>;
}

interface LockManifest {
  packages: Record<string, { version?: string }>;
}

const projectRoot = path.join(__dirname, '..');

describe('@nestjs/common upgrade', () => {
  it('tracks the 12.x release line and leaves the middleware route untouched', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'),
    ) as PackageManifest;
    const lock = JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package-lock.json'), 'utf8'),
    ) as LockManifest;

    expect(pkg.dependencies['@nestjs/common']).toMatch(/^\^12\./);
    expect(lock.packages['node_modules/@nestjs/common'].version).toMatch(
      /^12\./,
    );

    const appModule = fs.readFileSync(
      path.join(__dirname, 'app.module.ts'),
      'utf8',
    );
    expect(appModule).toContain("path: '*'");
  });
});
