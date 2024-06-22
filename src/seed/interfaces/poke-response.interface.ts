export interface PokeResponse {
  count: number;
  next: string;
  previous: null;
  results: Pokemons[];
}

interface Pokemons {
  name: string;
  url: string;
}
