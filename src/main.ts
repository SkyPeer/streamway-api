const isDev = process.env.IS_TS_NODE;
if (!isDev) {
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);

  // FOR DEBUG!
  // process.on('uncaughtException', function (err) {
  //   console.error(err);
  //   console.log("Node NOT Exiting...");
  // });
}
bootstrap();
