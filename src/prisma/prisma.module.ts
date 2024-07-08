import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Exports will be available in the entire app
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
