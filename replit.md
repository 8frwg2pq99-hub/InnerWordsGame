# InnerWords - Word Puzzle Game

InnerWords is a single-player word puzzle game where players extract contiguous letter sequences from words to create new valid English dictionary words.

## Project Overview

**Game Concept**: Players select from 5 starting words (CORIANDER, CHEWINESS, MASTODON, SCUTTLING, REWINDER) and must create new words by using contiguous sequences of letters from the current word. The game continues for 60 seconds, challenging players to score as many points as possible. Each starting word has its own dedicated leaderboard.

**Target Domain**: inner words.app

## Game Mechanics

### Core Rules
1. Players must create new words containing at least 2 consecutive letters from the current word
2. The sequence must be contiguous (no gaps or insertions within the sequence)
3. Game duration: 60 seconds
4. No dictionary validation (currently accepts any letter combination)

### Scoring System
- **Inner Sequences**: 2 points per letter (sequences not at the start or end)
- **Edge Sequences**: 1 point per letter (sequences at the start or end)
- **Length Bonus**: +1 point for each additional letter beyond previous word length

### Ranking System
- **S Rank**: 100+ points
- **A Rank**: 90-99 points
- **B Rank**: 80-89 points
- **C Rank**: 60-79 points
- **D Rank**: 40-59 points
- **E Rank**: 0-39 points

## Features

### Word Selection
- **5 Starting Words**: CORIANDER, CHEWINESS, MASTODON, SCUTTLING, REWINDER
- **Word-Specific Leaderboards**: Each starting word has its own dedicated leaderboard
- **Default Word**: CORIANDER is selected by default
- **Easy Switching**: Click any word button to change the starting word before or between games

### Authentication
- **Optional Authentication**: Players can play without logging in
- **Replit Auth Integration**: Support for Google, GitHub, and email/password login
- **Score Submission**: Only authenticated users can submit scores to the leaderboard
- **Session Management**: Sessions stored in PostgreSQL with automatic token refresh

### Leaderboard
- **Top 5 Preview**: Game over summary displays top 5 scores for the current word (no login required)
- **Word-Specific View**: Full top 100 scores filtered by selected starting word, viewable by authenticated users only
- **Simplified Display**: Shows player name, score, rank, and number of turns for easy comparison
- **Real-time Updates**: Leaderboard refreshes after score submission
- **Security**: Rank values calculated server-side to prevent client manipulation

### User Experience
- Free play for all users
- Login prompt shown only when attempting to submit scores
- Seamless authentication flow with automatic redirects
- Responsive design with dark theme
- End Run button to immediately finish game and view summary

## Technical Architecture

### Frontend
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **State Management**: React Query (TanStack Query)
- **UI Components**: Shadcn UI with Tailwind CSS
- **Styling**: Custom dark theme with accent colors

### Backend
- **Server**: Express.js
- **Authentication**: Replit Auth (OpenID Connect)
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Session Store**: PostgreSQL-based sessions

### Database Schema

#### Users Table
- `id` (varchar, primary key, UUID)
- `email` (varchar)
- `firstName` (varchar)
- `lastName` (varchar)
- `createdAt` (timestamp)

#### Sessions Table
- `sid` (varchar, primary key)
- `sess` (jsonb)
- `expire` (timestamp)

#### Leaderboard Entries Table
- `id` (serial, primary key)
- `userId` (varchar, foreign key to users)
- `score` (integer)
- `turnsCount` (integer)
- `rank` (varchar)
- `startingWord` (varchar, NOT NULL, default 'CORIANDER')
- `createdAt` (timestamp)

### API Endpoints

#### Authentication
- `GET /api/login` - Initiates Replit Auth login flow
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/logout` - Logs out user and destroys session
- `GET /api/auth/user` - Returns current authenticated user info

#### Leaderboard
- `POST /api/leaderboard` - Submit score (requires authentication)
  - Body: `{ score: number, turnsCount: number, startingWord: string }`
  - Rank calculated server-side based on score
- `GET /api/leaderboard/top?limit=100&word={word}` - Get top scores filtered by starting word (public)

## Security Considerations

### Implemented
- Server-side rank calculation prevents client manipulation
- Authentication required for score submission
- Session-based authentication with secure cookies
- PostgreSQL session storage for scalability
- User ID validation on score submission

### Future Improvements
- Dictionary validation to ensure valid English words
- Rate limiting on score submissions
- Additional input validation and sanitization
- CAPTCHA or similar protection against automated submissions

## Development

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database credentials

### Running the Project
```bash
npm run dev
```

This starts both the Express backend and Vite frontend on the same port.

### Database Management
```bash
npm run db:push       # Sync schema to database
npm run db:push --force  # Force sync (if conflicts)
npm run db:studio     # Open Drizzle Studio for database inspection
```

## User Flow

### Anonymous Play
1. User visits the site
2. Immediately starts playing (no login required)
3. Timer starts on first valid move
4. Game ends after 60 seconds
5. Game over summary shows score, rank, and top 5 leaderboard preview
6. Login prompt appears if user wants to submit score

### Authenticated Play
1. User clicks "Log In" button
2. Redirects to Replit Auth
3. User authenticates via Google, GitHub, or email/password
4. Redirects back to game
5. User plays the game
6. After game over, user can submit score to leaderboard
7. Score appears on global leaderboard

### Viewing Leaderboard
1. Top 5 preview visible to all users in game over summary (no login required)
2. Clicking "Leaderboard" button requires authentication
3. Authenticated users see full top 100 scores with expandable turn sequences
4. Turn sequences show complete word progression paths
5. Multiple sequences can be expanded simultaneously for comparison
6. Users can close modal and return to game

## Design Guidelines

### Color Scheme
- Dark background with subtle gradients
- Primary accent color for interactive elements
- Clear visual hierarchy with text colors
- Border highlights for important elements

### Typography
- Clear, readable fonts
- Large, bold score display
- Consistent heading sizes
- Adequate spacing for readability

### Interactions
- Subtle hover effects on buttons
- Active states for pressed elements
- Smooth transitions and animations
- Loading states for async operations

## Future Enhancements

### Potential Features
1. **Dictionary Validation**: Integrate an English dictionary API
2. **Multiplayer**: Real-time competitive play
3. **Daily Challenges**: New starting words each day
4. **Personal Stats**: Track individual player statistics
5. **Achievements**: Unlock badges for milestones
6. **Difficulty Levels**: Different starting words and time limits
7. **Hint System**: Suggest possible words
8. **Word History**: Save and review past games

### Technical Improvements
1. Automated testing with Playwright
2. Performance optimization for large leaderboards
3. Pagination for leaderboard entries
4. Caching strategies for frequently accessed data
5. Analytics and metrics tracking
6. Error monitoring and logging
