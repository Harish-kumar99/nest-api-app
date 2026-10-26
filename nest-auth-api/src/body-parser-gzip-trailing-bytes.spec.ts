import * as express from 'express';
import * as http from 'http';
import * as zlib from 'zlib';

describe('body-parser gzip trailing bytes (GHSA-27r3-jxmh-p828)', () => {
  it('does not crash the process when trailing bytes follow a gzip body', async () => {
    const app = express();
    app.use(express.json());
    app.post('/echo', (req: express.Request, res: express.Response) => {
      res.json(req.body);
    });

    const server = await new Promise<http.Server>((resolve) => {
      const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });
    const port = (server.address() as { port: number }).port;

    // One valid gzip JSON frame followed by a zero byte and 100KB of padding.
    // On body-parser < 2.4.0 the decoder finishes the frame, the app responds
    // normally, and then the trailing bytes reach the already-finished decoder,
    // which emits an uncaught exception that terminates the process.
    const gzippedJson = Buffer.from(
      '1f8b0800000000000003ab564a54b232ac0500afac1b5607000000',
      'hex',
    );
    const body = Buffer.concat([
      gzippedJson,
      Buffer.from([0x00]),
      Buffer.alloc(100 * 1024, 0x58),
    ]);

    const crashes: unknown[] = [];
    const onUncaughtException = (err: unknown) => crashes.push(err);
    process.on('uncaughtException', onUncaughtException);

    try {
      const response = await new Promise<http.IncomingMessage>((resolve, reject) => {
        const req = http.request(
          {
            host: '127.0.0.1',
            port,
            path: '/echo',
            method: 'POST',
            agent: false,
            headers: {
              'Content-Type': 'application/json',
              'Content-Encoding': 'gzip',
              'Content-Length': body.length,
            },
          },
          (res) => resolve(res),
        );
        req.on('error', reject);
        req.end(body);
      });

      const chunks: Buffer[] = [];
      const responseBody = await new Promise<string>((resolve) => {
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(responseBody)).toEqual({ a: 1 });

      // Give any deferred decompression-stream error time to surface before
      // asserting it never did.
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(crashes).toHaveLength(0);
    } finally {
      process.removeListener('uncaughtException', onUncaughtException);
      server.close();
    }
  });
});
