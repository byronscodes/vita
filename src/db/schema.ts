import { pgTable, uuid, text, timestamp, integer, primaryKey, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Resumes
export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), 
  title: text('title').notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),

  applicationsCount: integer('applications_count'),
  interviewsCount: integer('interviews_count'),

  yearsOfExperience: text('years_of_experience'),   // e.g. "0-1 (Entry)", "2-5 (Mid)", "5+ (Senior)"
  targetRole: text('target_role').notNull(), // e.g. "Software Engineer", "Data Scientist"
  
  netVotes: integer('net_votes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Resume Interviews
export const interviews = pgTable('interviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  resumeId: uuid('resume_id').references(() => resumes.id, { onDelete: 'cascade' }).notNull(),
  company: text('company'), // e.g., "Google", "Apple"
  companyLevel: text('company_level'), // e.g., "FAANG", "Unicorn", "Startup"
  jobTitle: text('job_title'), // e.g., "Software Engineer II", "Senior Data Scientist"
});

// User Profiles
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), 
  anonymousHandle: text('anonymous_handle').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Comments
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  resumeId: uuid('resume_id').references(() => resumes.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Votes
export const votes = pgTable('votes', {
  userId: uuid('user_id').notNull(),
  resumeId: uuid('resume_id').references(() => resumes.id, { onDelete: 'cascade' }).notNull(),
  voteType: integer('vote_type').notNull(), // 1 for upvote, -1 for downvote
}, (votesColumns) => [
  primaryKey({ columns: [votesColumns.userId, votesColumns.resumeId] }),
  check('vote_type_check', sql`${votesColumns.voteType} IN (1, -1)`),
]);