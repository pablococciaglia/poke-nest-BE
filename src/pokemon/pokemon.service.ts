import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    console.log(this.configService.get('limitByDefault'));
    console.log(this.configService.get('offsetByDefault'));
    const {
      limit = this.configService.get('limitByDefault'),
      offset = this.configService.get('offsetByDefault'),
    } = paginationDto;
    const pokemon = await this.pokemonModel.find().limit(limit).skip(offset);

    return pokemon;
  }

  async findOne(searchTerm: string) {
    let pokemon: Pokemon;
    if (!isNaN(+searchTerm)) {
      pokemon = await this.pokemonModel.findOne({ no: searchTerm });
    } else if (isValidObjectId(searchTerm)) {
      pokemon = await this.pokemonModel.findById(searchTerm);
    } else {
      pokemon = await this.pokemonModel.findOne({
        name: searchTerm.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no #${searchTerm} not found`,
      );
    return pokemon;
  }

  async update(searchTerm: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(searchTerm);
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no #${searchTerm} not found`,
      );
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // this would be enough to remove, but a custom pipe is use to do it.
  // async remove(id: string) {
  //   const pokemon = await this.findOne(id);
  //   await pokemon.deleteOne();
  //   return `pokemon #${id} was removed`;
  // }

  async remove(id: string) {
    const pokemon = await this.pokemonModel.deleteOne({ _id: id });
    if (!pokemon.deletedCount)
      throw new BadRequestException(`pokemon #${id} not found`);

    return `pokemon #${id} was removed`;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in DB ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Cant create Pokemon - check server logs',
    );
  }
}
