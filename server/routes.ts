import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLeaderboardEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Helper function to calculate rank based on score
  function calculateRank(score: number): string {
    if (score >= 100) return 'S';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 60) return 'C';
    if (score >= 40) return 'D';
    return 'E';
  }

  // Leaderboard routes
  app.post('/api/leaderboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { score, turnsCount, turns, startingWord } = req.body;
      
      // Calculate rank server-side to prevent tampering
      const rank = calculateRank(score);
      
      const data = insertLeaderboardEntrySchema.parse({
        userId,
        score,
        turnsCount,
        rank,
        startingWord: startingWord || 'CORIANDER',
        turns,
      });
      
      const entry = await storage.submitScore(data);
      res.json(entry);
    } catch (error: any) {
      console.error("Error submitting score:", error);
      res.status(400).json({ message: error.message || "Failed to submit score" });
    }
  });

  // Generate mock leaderboard entries for each starting word
  // Names from Robert Altman film characters
  function getMockScores(startingWord: string = 'CORIANDER') {
    const mockData: { [key: string]: any[] } = {
      'CORIANDER': [
        { firstName: 'Barbara', lastName: 'Jean', email: 'barbara.jean@example.com', score: 92, turnsCount: 12, rank: 'A' },
        { firstName: 'Linnea', lastName: 'Reese', email: 'linnea.r@example.com', score: 87, turnsCount: 10, rank: 'B' },
        { firstName: 'Haven', lastName: 'Hamilton', email: 'haven.h@example.com', score: 78, turnsCount: 9, rank: 'C' },
        { firstName: 'Sueleen', lastName: 'Gay', email: 'sueleen.g@example.com', score: 71, turnsCount: 8, rank: 'C' },
        { firstName: 'John', lastName: 'Triplette', email: 'j.triplette@example.com', score: 65, turnsCount: 7, rank: 'C' },
      ],
      'CHEWINESS': [
        { firstName: 'Hawkeye', lastName: 'Pierce', email: 'hawkeye.p@example.com', score: 89, turnsCount: 11, rank: 'A' },
        { firstName: 'Trapper', lastName: 'McIntyre', email: 'trapper.m@example.com', score: 84, turnsCount: 10, rank: 'B' },
        { firstName: 'Margaret', lastName: 'Houlihan', email: 'hot.lips@example.com', score: 76, turnsCount: 9, rank: 'C' },
        { firstName: 'Duke', lastName: 'Forrest', email: 'duke.f@example.com', score: 68, turnsCount: 8, rank: 'C' },
        { firstName: 'Frank', lastName: 'Burns', email: 'frank.b@example.com', score: 59, turnsCount: 7, rank: 'D' },
      ],
      'MASTODON': [
        { firstName: 'Philip', lastName: 'Marlowe', email: 'p.marlowe@example.com', score: 95, turnsCount: 13, rank: 'A' },
        { firstName: 'Constance', lastName: 'Miller', email: 'mrs.miller@example.com', score: 88, turnsCount: 11, rank: 'B' },
        { firstName: 'John', lastName: 'McCabe', email: 'j.mccabe@example.com', score: 81, turnsCount: 10, rank: 'B' },
        { firstName: 'Pinky', lastName: 'Rose', email: 'pinky.r@example.com', score: 74, turnsCount: 9, rank: 'C' },
        { firstName: 'Millie', lastName: 'Lammoreaux', email: 'millie.l@example.com', score: 62, turnsCount: 7, rank: 'C' },
      ],
      'SCUTTLING': [
        { firstName: 'Griffin', lastName: 'Mill', email: 'griffin.m@example.com', score: 91, turnsCount: 12, rank: 'A' },
        { firstName: 'Mary', lastName: 'Maceachran', email: 'mary.m@example.com', score: 85, turnsCount: 10, rank: 'B' },
        { firstName: 'Robert', lastName: 'Parks', email: 'robert.p@example.com', score: 79, turnsCount: 9, rank: 'C' },
        { firstName: 'Brewster', lastName: 'McCloud', email: 'brewster.m@example.com', score: 70, turnsCount: 8, rank: 'C' },
        { firstName: 'Bill', lastName: 'Denny', email: 'bill.d@example.com', score: 64, turnsCount: 7, rank: 'C' },
      ],
      'REWINDER': [
        { firstName: 'Yolanda', lastName: 'Johnson', email: 'yolanda.j@example.com', score: 94, turnsCount: 13, rank: 'A' },
        { firstName: 'Rhonda', lastName: 'Johnson', email: 'rhonda.j@example.com', score: 86, turnsCount: 11, rank: 'B' },
        { firstName: 'Connie', lastName: 'White', email: 'connie.w@example.com', score: 77, turnsCount: 9, rank: 'C' },
        { firstName: 'Lady', lastName: 'Pearl', email: 'lady.pearl@example.com', score: 69, turnsCount: 8, rank: 'C' },
        { firstName: 'Charlie', lastName: 'Walters', email: 'charlie.w@example.com', score: 61, turnsCount: 7, rank: 'C' },
      ],
    };

    const mockEntries = mockData[startingWord] || mockData['CORIANDER'];
    return mockEntries.map((entry, index) => ({
      id: -(index + 1), // Negative IDs to distinguish from real entries
      userId: `mock-${startingWord.toLowerCase()}-${index}`,
      score: entry.score,
      turnsCount: entry.turnsCount,
      rank: entry.rank,
      startingWord,
      createdAt: new Date().toISOString(),
      user: {
        firstName: entry.firstName,
        lastName: entry.lastName,
        email: entry.email,
        profileImageUrl: null,
      }
    }));
  }

  app.get('/api/leaderboard/top', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const startingWord = req.query.word as string || 'CORIANDER';
      
      // Get real scores from database
      const realScores = await storage.getTopScores(1000, startingWord);
      
      // Get mock scores for this starting word
      const mockScores = getMockScores(startingWord);
      
      // Merge and sort by score (highest first)
      const allScores = [...mockScores, ...realScores].sort((a, b) => b.score - a.score);
      
      // Return top N scores (default top 5 for game-over summary, or top 100 for full leaderboard)
      res.json(allScores.slice(0, limit));
    } catch (error) {
      console.error("Error fetching top scores:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get('/api/leaderboard/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const startingWord = req.query.word as string | undefined;
      const bestScore = await storage.getUserBestScore(userId, startingWord);
      res.json(bestScore || null);
    } catch (error) {
      console.error("Error fetching user best score:", error);
      res.status(500).json({ message: "Failed to fetch user score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
