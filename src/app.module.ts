// Nest
import { MiddlewareConsumer, Module } from '@nestjs/common';
// Middlewares
import { Trimmer } from './middleware/trimmer.middleware';
import { Deserialize } from './middleware/deserialize.middleware';
import { EmailToLowerCase } from './middleware/emailLowerCase.middleware';
import { prismaHashPasswordMiddleware } from './middleware/prismaHashPassword.middleware';
// Modules
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './utils/jwt/jwt.module';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from './resource/users/users.module';
import { AdminModule } from './resource/admin/admin.module';
import { TrainsModule } from './resource/trains/trains.module';
import { PricesModule } from './resource/prices/prices.module';
import { RoutesModule } from './resource/routes/routes.module';
import { TicketsModule } from './resource/tickets/tickets.module';
import { CarriageModule } from './resource/carriage/carriage.module';
import { StationsModule } from './resource/stations/stations.module';
import { EmployeesModule } from './resource/employees/employees.module';
import { BossModule } from './resource/boss/boss.module';
import { ManagerModule } from './resource/manager/manager.module';
// Config
import { publicPath } from './config/files.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [prismaHashPasswordMiddleware()],
        prismaOptions: {
          datasources: {
            db: {
              url:
                process.env.NODE_ENV === 'test'
                  ? process.env.TEST_DATABASE_URL
                  : process.env.DATABASE_URL,
            },
          },
        },
      },
    }),
    MulterModule.register({
      dest: `./${publicPath}`,
    }),
    JwtModule,
    StationsModule,
    TrainsModule,
    PricesModule,
    RoutesModule,
    CarriageModule,
    EmployeesModule,
    TicketsModule,
    UsersModule,
    AdminModule,
    ManagerModule,
    BossModule,
  ],
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: PostInterceptor,
  //   },
  // ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Trimmer).forRoutes('*');
    consumer.apply(EmailToLowerCase).forRoutes('*');
    consumer.apply(Deserialize).forRoutes('*');
  }
}
