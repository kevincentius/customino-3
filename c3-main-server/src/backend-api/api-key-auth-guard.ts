import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { config } from 'config/config';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    const headers: string[] = request.rawHeaders;
    console.log(headers);
    return headers.indexOf('Api-Key ' + config.backendApiSecret) != -1;
  }
}