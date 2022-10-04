import { Module } from '@nestjs/common';
import { AuthModule } from 'public-api/auth/auth.module';
import { AccountModule } from 'shared-modules/account/account.module';
import { DebugModule } from './debug/debug.module';

export const publicApiModules = [
  AccountModule,
  AuthModule,
  DebugModule,
];

@Module({
  imports: [
    ...publicApiModules,
  ],
})
export class PublicApiModule {}
