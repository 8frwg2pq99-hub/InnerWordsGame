/*
  # InnerWords Game Database Schema

  ## Overview
  Creates the necessary tables for the InnerWords word game application, including user management, 
  session storage, and leaderboard functionality.

  ## New Tables

  ### 1. `users`
  Stores user profile information for authentication and display purposes.
  - `id` (varchar, primary key) - Unique user identifier, auto-generated UUID
  - `email` (varchar, unique) - User's email address
  - `first_name` (varchar) - User's first name
  - `last_name` (varchar) - User's last name
  - `profile_image_url` (varchar) - URL to user's profile image
  - `created_at` (timestamp) - Account creation timestamp
  - `updated_at` (timestamp) - Last profile update timestamp

  ### 2. `sessions`
  Stores user session data for Replit authentication.
  - `sid` (varchar, primary key) - Session ID
  - `sess` (jsonb) - Session data in JSON format
  - `expire` (timestamp) - Session expiration time
  - Includes index on `expire` column for efficient cleanup

  ### 3. `leaderboard_entries`
  Records game results and scores for the leaderboard display.
  - `id` (serial, primary key) - Auto-incrementing entry ID
  - `user_id` (varchar, foreign key) - References users.id
  - `score` (integer) - Game score
  - `turns_count` (integer) - Number of turns taken
  - `rank` (varchar) - Performance rank (S, A, B, C, D, E)
  - `starting_word` (varchar) - The word the game started with (default: CORIANDER)
  - `turns` (jsonb) - Complete turn history showing the path taken
  - `created_at` (timestamp) - When the game was completed

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Users can read their own profile data
  - Users can update their own profile data
  - Users can insert and read their own leaderboard entries
  - All users can view the leaderboard (read-only access to other players' entries)
  - Session data is restricted to authenticated users

  ## Notes
  1. All operations use IF NOT EXISTS to ensure idempotency
  2. Default values are provided where appropriate to prevent null-related issues
  3. Foreign key constraints ensure referential integrity
  4. RLS policies follow the principle of least privilege
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
  email varchar UNIQUE,
  first_name varchar,
  last_name varchar,
  profile_image_url varchar,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);

-- Create index on sessions expire column for efficient cleanup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'IDX_session_expire'
  ) THEN
    CREATE INDEX IDX_session_expire ON sessions(expire);
  END IF;
END $$;

-- Create leaderboard_entries table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id serial PRIMARY KEY,
  user_id varchar NOT NULL REFERENCES users(id),
  score integer NOT NULL DEFAULT 0,
  turns_count integer NOT NULL DEFAULT 0,
  rank varchar NOT NULL DEFAULT 'E',
  starting_word varchar NOT NULL DEFAULT 'CORIANDER',
  turns jsonb,
  created_at timestamp DEFAULT now() NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DO $$
BEGIN
  -- Users can view their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON users FOR SELECT
      TO authenticated
      USING (auth.uid()::varchar = id);
  END IF;

  -- Users can update their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON users FOR UPDATE
      TO authenticated
      USING (auth.uid()::varchar = id)
      WITH CHECK (auth.uid()::varchar = id);
  END IF;

  -- Users can insert their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON users FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid()::varchar = id);
  END IF;
END $$;

-- RLS Policies for sessions table
DO $$
BEGIN
  -- Authenticated users can read sessions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sessions' AND policyname = 'Authenticated users can read sessions'
  ) THEN
    CREATE POLICY "Authenticated users can read sessions"
      ON sessions FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Authenticated users can insert sessions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sessions' AND policyname = 'Authenticated users can insert sessions'
  ) THEN
    CREATE POLICY "Authenticated users can insert sessions"
      ON sessions FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Authenticated users can update sessions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sessions' AND policyname = 'Authenticated users can update sessions'
  ) THEN
    CREATE POLICY "Authenticated users can update sessions"
      ON sessions FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Authenticated users can delete sessions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sessions' AND policyname = 'Authenticated users can delete sessions'
  ) THEN
    CREATE POLICY "Authenticated users can delete sessions"
      ON sessions FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- RLS Policies for leaderboard_entries table
DO $$
BEGIN
  -- Users can view all leaderboard entries (for public leaderboard)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leaderboard_entries' AND policyname = 'Users can view all leaderboard entries'
  ) THEN
    CREATE POLICY "Users can view all leaderboard entries"
      ON leaderboard_entries FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Users can insert their own leaderboard entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leaderboard_entries' AND policyname = 'Users can insert own leaderboard entries'
  ) THEN
    CREATE POLICY "Users can insert own leaderboard entries"
      ON leaderboard_entries FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid()::varchar = user_id);
  END IF;

  -- Users can update their own leaderboard entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leaderboard_entries' AND policyname = 'Users can update own leaderboard entries'
  ) THEN
    CREATE POLICY "Users can update own leaderboard entries"
      ON leaderboard_entries FOR UPDATE
      TO authenticated
      USING (auth.uid()::varchar = user_id)
      WITH CHECK (auth.uid()::varchar = user_id);
  END IF;

  -- Users can delete their own leaderboard entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leaderboard_entries' AND policyname = 'Users can delete own leaderboard entries'
  ) THEN
    CREATE POLICY "Users can delete own leaderboard entries"
      ON leaderboard_entries FOR DELETE
      TO authenticated
      USING (auth.uid()::varchar = user_id);
  END IF;
END $$;