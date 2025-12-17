#!/usr/bin/env tsx

import { DatabaseService } from '../server/services/databaseService'
import { UserService } from '../server/services/userService'

async function testDatabase() {
  console.log('🧪 Testing PostgreSQL Database Connection...\n')

  try {
    const db = DatabaseService.getInstance()
    const isConnected = await db.testConnection()
    
    if (!isConnected) {
      console.error('❌ Database connection failed')
      process.exit(1)
    }

    // Test UserService
    console.log('👤 Testing UserService...')
    const userService = UserService.getInstance()
    
    // Get all users
    const users = await userService.getAllUsers()
    console.log(`✅ Found ${users.length} users`)
    
    if (users.length > 0) {
      const firstUser = users[0]
      console.log(`   First user: ${firstUser.name} (${firstUser.email})`)
      
      // Test getUserWithGames
      const userWithGames = await userService.getUserWithGames(firstUser.id)
      if (userWithGames) {
        console.log(`   User has ${userWithGames.games.length} games`)
      }
    }
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  } finally {
    // Close database connection
    const db = DatabaseService.getInstance()
    await db.close()
    console.log('\n🔌 Database connection closed')
  }
  console.log('\n✅ All database tests passed!')
}

// Run the test
testDatabase().catch(console.error)
