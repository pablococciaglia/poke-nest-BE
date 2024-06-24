import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { joiValidationSchema } from './config/joi.validation';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      // not necesary to have both. but could happen.
      load: [EnvConfiguration],
      validationSchema: [joiValidationSchema],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(process.env.MONGODB, { dbName: 'pokeDB' }),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
