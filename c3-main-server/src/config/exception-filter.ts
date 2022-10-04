
import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const statusCode = ctx?.getResponse<Response>()?.statusCode;
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (statusCode != 401 && statusCode != 403 && !(exception instanceof UnauthorizedException)) {
      console.trace(exception);
    }
    
    response
      .status(500)
      .json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}