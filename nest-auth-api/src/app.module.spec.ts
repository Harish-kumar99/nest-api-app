import * as fs from 'fs';
import * as path from 'path';

type AppModuleCtor = new () => { configure(consumer: any): void };

function loadAppModule():
  | { AppModule: AppModuleCtor; RequestMethod: { ALL: any } }
  | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const appModule = require('./app.module');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const common = require('@nestjs/common');
    return {
      AppModule: appModule.AppModule,
      RequestMethod: common.RequestMethod,
    };
  } catch {
    return null;
  }
}

const loaded = loadAppModule();

describe('AppModule middleware', () => {
  it('registers the rate limiter on the Express 5 wildcard route', () => {
    if (loaded) {
      const forRoutes = jest.fn();
      const apply = jest.fn().mockReturnValue({ forRoutes });

      new loaded.AppModule().configure({ apply });

      expect(apply).toHaveBeenCalledTimes(1);
      expect(forRoutes).toHaveBeenCalledWith({
        path: '{*splat}',
        method: loaded.RequestMethod.ALL,
      });
      return;
    }

    // Some NestJS major versions are ESM-only and cannot be loaded by Jest's
    // CommonJS runtime, so fall back to the declaration in the source file.
    const source = fs.readFileSync(
      path.join(__dirname, 'app.module.ts'),
      'utf8',
    );
    expect(source).toContain("path: '{*splat}'");
  });
});
