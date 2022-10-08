import { Module } from '@nestjs/common';
import { AuthModule } from 'public-api/auth/auth.module';
import { AccountModule } from 'shared-modules/account/account.module';
import { DataModule } from 'shared-modules/data/data.module';
import { DebugModule } from './debug/debug.module';

export const publicApiModules = [
  AccountModule,
  AuthModule,
  DebugModule,
  DataModule,
];

@Module({
  imports: [
    ...publicApiModules,
  ],
})
export class PublicApiModule {}
