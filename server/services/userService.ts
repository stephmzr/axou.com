import { DatabaseService } from './databaseService'
import type { 
  User, 
  UserWithGames, 
  UserGame, 
  UserGameWithGame, 
  CreateUserRequest, 
  UpdateUserRequest,
  CreateUserGameRequest,
  DbUser,
  DbUserGame
} from '../../types'

export class UserService {
  private static instance: UserService
  private db: DatabaseService

  private constructor() {
    this.db = DatabaseService.getInstance()
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.db.queryAll<DbUser>(`
      SELECT id, name, email, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `)

    return result.map(this.mapUserFromDb)
  }

  async getUserById(id: number): Promise<User | null> {
    const result = await this.db.query<DbUser>(`
      SELECT id, name, email, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `, [id])
    
    if (result === null) return null
    return this.mapUserFromDb(result)
  }

  async getUserWithGames(id: number): Promise<UserWithGames | null> {
    const result = await this.db.queryAll<DbUser & {
      user_game_id?: number;
      play_time_hours?: number;
      rating?: number;
      is_favorite?: boolean;
      user_game_created_at?: Date;
      user_game_updated_at?: Date;
      game_id?: number;
      game_name?: string;
      description?: string;
      genre?: string;
      game_created_at?: Date;
      game_updated_at?: Date;
    }>(`
      SELECT 
        u.id, u.name, u.email, u.created_at, u.updated_at,
        ug.id as user_game_id, ug.play_time_hours, ug.rating, ug.is_favorite, ug.created_at as user_game_created_at, ug.updated_at as user_game_updated_at,
        g.id as game_id, g.name as game_name, g.description, g.genre, g.created_at as game_created_at, g.updated_at as game_updated_at
      FROM users u
      LEFT JOIN user_games ug ON u.id = ug.user_id
      LEFT JOIN games g ON ug.game_id = g.id
      WHERE u.id = $1
      ORDER BY ug.is_favorite DESC, ug.rating DESC
    `, [id])

    if (result.length === 0) return null

    const user = this.mapUserFromDb(result[0])
    const games: UserGameWithGame[] = []
    
    for (const row of result) {
      if (row.user_game_id && row.game_id && row.game_name && row.user_game_created_at && row.user_game_updated_at && row.game_created_at && row.game_updated_at) {
        games.push({
          id: row.user_game_id,
          userId: user.id,
          gameId: row.game_id,
          playTimeHours: row.play_time_hours || 0,
          rating: row.rating,
          isFavorite: row.is_favorite || false,
          createdAt: row.user_game_created_at,
          updatedAt: row.user_game_updated_at,
          game: {
            id: row.game_id,
            name: row.game_name,
            description: row.description,
            genre: row.genre,
            createdAt: row.game_created_at,
            updatedAt: row.game_updated_at
          }
        })
      }
    }

    return { ...user, games }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const result = await this.db.query<DbUser>(`
      INSERT INTO users (name, email) 
      VALUES ($1, $2) 
      RETURNING id, name, email, created_at, updated_at
    `, [userData.name, userData.email])
    
    return this.mapUserFromDb(result)
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User | null> {
    const setClause = []
    const values = []
    let paramCount = 1

    if (userData.name !== undefined) {
      setClause.push(`name = $${paramCount}`)
      values.push(userData.name)
      paramCount++
    }
    if (userData.email !== undefined) {
      setClause.push(`email = $${paramCount}`)
      values.push(userData.email)
      paramCount++
    }

    if (setClause.length === 0) {
      return this.getUserById(id)
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const result = await this.db.query<DbUser>(`
      UPDATE users 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, name, email, created_at, updated_at
    `, values)

    if (result === null) return null
    return this.mapUserFromDb(result)
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db.query<User>(`
      DELETE FROM users 
      WHERE id = $1
    `, [id])
    
    return result !== null
  }

  // ===== USER-GAME RELATIONSHIP METHODS =====

  async addGameToUser(userGameData: CreateUserGameRequest): Promise<UserGame> {
    const result = await this.db.query<DbUserGame>(`
      INSERT INTO user_games (user_id, game_id, play_time_hours, rating, is_favorite) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, user_id, game_id, play_time_hours, rating, is_favorite, created_at, updated_at
    `, [
      userGameData.userId, 
      userGameData.gameId, 
      userGameData.playTimeHours || 0, 
      userGameData.rating, 
      userGameData.isFavorite || false
    ])
    
    return this.mapUserGameFromDb(result)
  }

  // ===== HELPER METHODS =====

  private mapUserFromDb(row: DbUser): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }


  private mapUserGameFromDb(row: DbUserGame): UserGame {
    return {
      id: row.id,
      userId: row.user_id,
      gameId: row.game_id,
      playTimeHours: row.play_time_hours,
      rating: row.rating,
      isFavorite: row.is_favorite,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
