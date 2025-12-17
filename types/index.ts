export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  games?: UserGame[];
}

export interface DbUser {
  id: number
  name: string
  email: string
  created_at: Date
  updated_at: Date
  games: DbUserGame[]
}

export interface Game {
  id: number;
  name: string;
  description?: string;
  genre?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbGame {
  id: number;
  name: string;
  description?: string;
  genre?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserGame {
  id: number;
  userId: number;
  gameId: number;
  playTimeHours: number;
  rating?: number;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  game?: Game;
}

export interface DbUserGame {
  id: number
  user_id: number
  game_id: number
  play_time_hours: number
  rating: number
  is_favorite: boolean
  created_at: Date
  updated_at: Date
}

export interface UserWithGames extends User {
  games: UserGameWithGame[];
}

export interface UserGameWithGame extends UserGame {
  game: Game;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface CreateUserGameRequest {
  userId: number;
  gameId: number;
  playTimeHours?: number;
  rating?: number;
  isFavorite?: boolean;
}

export interface UpdateUserGameRequest {
  playTimeHours?: number;
  rating?: number;
  isFavorite?: boolean;
}

export interface CreateGameRequest {
  name: string;
  description?: string;
  genre?: string;
}

export interface UpdateGameRequest {
  name?: string;
  description?: string;
  genre?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

export interface PokemonResponse {
  id: number;
  name: string;
  types: Record<string, any>[];
  sprites: {
    front_default: string;
  }
}