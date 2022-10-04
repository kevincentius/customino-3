import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  async parseJwtToken(jwtToken: string): Promise<any> {
    return this.jwtService.verify(jwtToken);
  }
}
