const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  college: z.string().min(2, 'College name is required'),
  branch: z.string().optional().default(''),
  yearOfStudy: z.string().optional().default('3rd Year'),
  avatar: z.string().optional().default(''),
  technicalSkills: z.array(z.string()).optional().default([]),
  nonTechnicalSkills: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
  experience: z.string().optional().default('Beginner (0 hackathons)'),
  githubUrl: z.string().optional().default(''),
  linkedinUrl: z.string().optional().default(''),
  portfolioUrl: z.string().optional().default(''),
  bio: z.string().optional().default(''),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  college: z.string().min(2, 'College is required').optional(),
  branch: z.string().optional(),
  yearOfStudy: z.string().optional(),
  avatar: z.string().optional(),
  technicalSkills: z.array(z.string()).optional(),
  nonTechnicalSkills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  experience: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  bio: z.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
