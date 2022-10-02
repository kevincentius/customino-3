
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const statusCode = ctx?.getResponse<Response>()?.statusCode;
    if (statusCode != 401 && statusCode != 403) {
      console.trace(exception);
    }
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response
      .status(500)
      .json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}