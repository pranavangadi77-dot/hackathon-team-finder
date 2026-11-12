const { z } = require('zod');

const createTeamSchema = z.object({
  teamName: z.string().optional(),
  name: z.string().min(2, 'Team name must be at least 2 characters').max(80).optional(),
  projectTitle: z.string().optional().default(''),
  hackathonName: z.string().min(2, 'Hackathon name is required').max(100),
  description: z.string().min(5, 'Project description must be at least 5 characters'),
  problemStatement: z.string().optional().default(''),
  category: z.string().optional().default('Open Innovation'),
  college: z.string().optional().default(''),
  requiredSkills: z.array(z.string().min(1)).optional().default([]),
  missingSkills: z.array(z.string().min(1)).optional().default([]),
  availableRoles: z.array(z.string().min(1)).optional().default([]),
  maximumMembers: z.number().int().min(2).max(10).optional(),
  maxMembers: z.number().int().min(2).max(10).optional().default(4),
  preferredExperience: z.string().optional().default('Any'),
  hackathonDeadline: z.string().optional(),
  applicationDeadline: z.string().optional(),
  hackathonDate: z.string().optional(),
  eventDate: z.string().optional(),
  contactInfo: z.string().optional().default(''),
  visibility: z.string().optional().default('Public'),
  status: z.string().optional().default('Open'),
});

const updateTeamSchema = createTeamSchema.partial();

const joinRequestSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  message: z.string().min(3, 'Message must be at least 3 characters').max(500),
});

module.exports = {
  createTeamSchema,
  updateTeamSchema,
  joinRequestSchema,
};
