import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const isLocalDatabase = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? '');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocalDatabase ? undefined : { rejectUnauthorized: false },
});

@Injectable()
export class PrismaService
extends PrismaClient
implements OnModuleInit {

constructor() {
  super({ adapter });
}

async onModuleInit() {
  await this.$connect();
}

}
