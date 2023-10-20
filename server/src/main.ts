import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// import { MongoMemoryServer } from 'mongodb-memory-server';

// // This will create an new instance of "MongoMemoryServer" and automatically start it
// const mongod = await MongoMemoryServer.create();

// const uri = mongod.getUri();
// console.log(uri);

// // The Server can be stopped again with
// await mongod.stop();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
