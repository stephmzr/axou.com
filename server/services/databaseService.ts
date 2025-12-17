import { Pool, type PoolClient } from 'pg'
import { config } from 'dotenv'
config()

export class DatabaseService {
  private static instance: DatabaseService
  private pool: Pool

  private constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      database: process.env.DB_NAME || 'typescript_vue_db',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect()
  }

  async query<T>(text: string, params?: unknown[]): Promise<T> {
    const client = await this.getClient()
    try {
      const result = await client.query(text, params)
      return result.rows[0] as T
    } finally {
      client.release()
    }
  }

  async queryAll<T>(text: string, params?: unknown[]): Promise<T[]> {
    const client = await this.getClient()
    try {
      const result = await client.query(text, params)
      return result.rows as T[]
    } finally {
      client.release()
    }
  }

  async close(): Promise<void> {
    await this.pool.end()
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.query<{ now: Date }>('SELECT NOW()')
      console.log('✅ Database connection successful:', result.now)
      return true
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      return false
    }
  }
}
