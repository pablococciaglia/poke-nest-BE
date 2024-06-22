import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AxiosAdapter } from './http-adapters/axios.adapter';

@Module({
  imports: [HttpModule],
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
})
export class CommonModule {}
