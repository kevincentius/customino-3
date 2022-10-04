import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'config/config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwtConstants.secret,
      signOptions: { expiresIn: config.jwtConstants.expiresIn },
    }),
  ],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
