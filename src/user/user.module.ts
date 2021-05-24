import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
  // 使用 forFeature() 方法注册储存库
  imports: [TypeOrmModule.forFeature([UserEntity])],
  // 注册Providers
  providers: [UserService],
  controllers: [
    UserController
  ],
  exports: [UserService]
})

/**
 * 中间件不能在 @Module() 装饰器中列出。
 * 我们必须使用模块类的 configure() 方法来设置它们。
 * 包含中间件的模块必须实现 NestModule 接口。
 * 我们将 LoggerMiddleware 设置在 ApplicationModule 层上。
 */
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'user', method: RequestMethod.GET}, {path: 'user', method: RequestMethod.PUT});
  }
}
