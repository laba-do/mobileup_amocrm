import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = app.get(ConfigService);
  const appPort = config.get<string>('app.port');
  const appHost = config.get<string>('app.host');
  const subdomain = config.get<string>('amocrm.subdomain');
  if (!subdomain) throw new Error('Fill the .env file with relevant keys');

  const proxyUrl = `https://${subdomain}.amocrm.ru`;

  app.use(
    ['/api/v4/companies'],
    createProxyMiddleware({
      target: proxyUrl,
      changeOrigin: true,
      onProxyRes: (proxyRes) => {
        const sc = proxyRes.headers['set-cookie'];
        if (Array.isArray(sc)) {
          proxyRes.headers['set-cookie'] = sc
            .map((sc) => {
              return sc
                .split(';')
                .filter((v) => v.trim().toLowerCase() !== 'secure')
                .join('; ');
            })
            .map((sc) => {
              return sc
                .split(';')
                .filter((v) => v.trim().toLowerCase() !== 'samesite=none')
                .join('; ');
            });
        }
      },
      // onProxyRes: (proxyRes) => {
      //   delete proxyRes.headers['access-control-allow-headers'];
      //   delete proxyRes.headers['access-control-allow-methods'];
      //   delete proxyRes.headers['access-control-allow-origin'];
      //   delete proxyRes.headers['access-control-expose-headers'];
      // },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('MobileUp amoCRM AUTH2.0')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Server')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(appPort, appHost, () => {
    logger.log(`The server is listening on http://${appHost}:${appPort}`);
  });
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
