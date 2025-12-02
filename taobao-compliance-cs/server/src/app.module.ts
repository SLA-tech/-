import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { SensitiveWordsModule } from './sensitive-words/sensitive-words.module';
import { TemplatesModule } from './templates/templates.module';
import { SessionsModule } from './sessions/sessions.module';
import { ReportsModule } from './reports/reports.module';
import { RedirectModule } from './redirect/redirect.module';
import { User } from './entities/user.entity';
import { Message } from './entities/message.entity';
import { SensitiveWord } from './entities/sensitive-word.entity';
import { AutomatedTemplate } from './entities/automated-template.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): SqliteConnectionOptions => ({
        type: 'sqlite',
        database: configService.get<string>('DB_PATH') || './data/taobao_cs.db',
        entities: [User, Message, SensitiveWord, AutomatedTemplate, AuditLog],
        synchronize: true, // 本地运行使用自动同步
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    MessagesModule,
    SensitiveWordsModule,
    TemplatesModule,
    SessionsModule,
    ReportsModule,
    RedirectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
