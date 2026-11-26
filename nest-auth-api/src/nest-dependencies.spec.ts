import * as fs from 'fs';
import * as path from 'path';

interface PackageManifest {
  dependencies: Record<string, string>;
}

interface LockManifest {
  packages: Record<string, { version?: string }>;
}

const projectRoot = path.join(__dirname, '..');
const upgradedVersion = '12.6.2';

describe('@nestjs/common and @nestjs/core upgrade', () => {
  it('pins both Nest packages to 12.6.2 in the manifest and the lockfile', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'),
    ) as PackageManifest;
    const lock = JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package-lock.json'), 'utf8'),
    ) as LockManifest;

    for (const name of ['@nestjs/common', '@nestjs/core']) {
      expect(pkg.dependencies[name]).toBe(`^${upgradedVersion}`);
      expect(lock.packages[`node_modules/${name}`].version).toBe(
        upgradedVersion,
      );
    }
  });
});
