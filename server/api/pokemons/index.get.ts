import type { ApiResponse, Pokemon, PokemonResponse } from "~~/types";

const POKEAPI_BASE_URL = useRuntimeConfig().pokeApiBaseUrl

export default defineEventHandler(async (): Promise<ApiResponse<Pokemon[]>> => {

  try {
    const pokemons = await $fetch<{ results: Pokemon[] }>(`${POKEAPI_BASE_URL}/pokemon?limit=100&offset=0`)
    const pokemonsList: Promise<PokemonResponse>[] = []

    for(const pokemon of pokemons.results) {
      pokemonsList.push($fetch<PokemonResponse>(`${POKEAPI_BASE_URL}/pokemon/${pokemon.name}`))
    }

    const pokemonData = await Promise.all(pokemonsList)

    return {
      success: true,
      data: pokemonData.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((type) => type.type.name),
        sprite: pokemon.sprites.front_default
      })),
      message: 'Pokemons fetched successfully'
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: 'Failed to fetch pokemons',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})