/**
 * 执行任意的代码
 * 对请求/响应做操作
 * 终结请求-响应周期
 * 调用下一个栈中的中间件函数
 * 如果当前的中间间函数没有终结请求响应周期，那么它必须调用 next() 方法将控制权传递给下一个中间件函数。否则请求将被挂起
 */
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import { UserService } from './user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('middelware')
    // 获取接口header中所携带的 authorization 字段
    // 验证接口所传token是否正确 若token正确则进入controller 否则返回错误信息
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      // 校验jwt token 是否正确
      const decoded: any = jwt.verify(token, SECRET);
      const user = await this.userService.findById(decoded.id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      req.user = user.user;
      next();

    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
