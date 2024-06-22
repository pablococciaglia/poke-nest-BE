import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/http-adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    this.pokemonModel.deleteMany({});
    // const response = fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
    // return response.then((s) => s.json());
    try {
      const data = await this.http.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=200',
      );

      const pokemonToInsert = [];
      data.results.forEach((poke) => {
        const segments = poke.url.split('/');
        const no = +segments[segments.length - 2];
        pokemonToInsert.push({ name: poke.name, no });
      });
      this.pokemonModel.insertMany(pokemonToInsert);

      return 'excecute seed was succesfull';
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Was not possible to save the in DB',
        },
        HttpStatus.EXPECTATION_FAILED,
        {
          cause: error,
        },
      );
    }
  }
}
