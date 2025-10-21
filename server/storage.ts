import {
  users,
  leaderboardEntries,
  type User,
  type UpsertUser,
  type InsertLeaderboardEntry,
  type LeaderboardEntry,
  type LeaderboardEntryWithUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Leaderboard operations
  submitScore(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  getTopScores(limit: number, startingWord?: string): Promise<LeaderboardEntryWithUser[]>;
  getUserBestScore(userId: string, startingWord?: string): Promise<LeaderboardEntry | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Leaderboard operations
  async submitScore(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const [leaderboardEntry] = await db
      .insert(leaderboardEntries)
      .values(entry)
      .returning();
    return leaderboardEntry;
  }

  async getTopScores(limit: number = 100, startingWord?: string): Promise<LeaderboardEntryWithUser[]> {
    let query = db
      .select({
        id: leaderboardEntries.id,
        userId: leaderboardEntries.userId,
        score: leaderboardEntries.score,
        turnsCount: leaderboardEntries.turnsCount,
        rank: leaderboardEntries.rank,
        startingWord: leaderboardEntries.startingWord,
        turns: leaderboardEntries.turns,
        createdAt: leaderboardEntries.createdAt,
        user: users,
      })
      .from(leaderboardEntries)
      .innerJoin(users, eq(leaderboardEntries.userId, users.id));

    if (startingWord) {
      query = query.where(eq(leaderboardEntries.startingWord, startingWord)) as any;
    }

    const results = await query
      .orderBy(desc(leaderboardEntries.score))
      .limit(limit);

    return results.map((row) => ({
      id: row.id,
      userId: row.userId,
      score: row.score,
      turnsCount: row.turnsCount,
      rank: row.rank,
      startingWord: row.startingWord,
      turns: row.turns,
      createdAt: row.createdAt,
      user: row.user,
    }));
  }

  async getUserBestScore(userId: string, startingWord?: string): Promise<LeaderboardEntry | undefined> {
    const conditions = [eq(leaderboardEntries.userId, userId)];
    
    if (startingWord) {
      conditions.push(eq(leaderboardEntries.startingWord, startingWord));
    }

    const [entry] = await db
      .select()
      .from(leaderboardEntries)
      .where(and(...conditions))
      .orderBy(desc(leaderboardEntries.score))
      .limit(1);
    return entry;
  }
}

export const storage = new DatabaseStorage();
