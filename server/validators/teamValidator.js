const { z } = require('zod');

const createTeamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters').max(60),
  projectTitle: z.string().min(3, 'Project title must be at least 3 characters').max(120),
  hackathonName: z.string().min(2, 'Hackathon name is required').max(100),
  description: z.string().min(10, 'Project description must be at least 10 characters'),
  problemStatement: z.string().min(15, 'Problem statement must be at least 15 characters'),
  category: z.string().optional().default('Open Innovation'),
  requiredSkills: z
    .array(z.string().min(1))
    .min(1, 'Please specify at least one required skill'),
  maxMembers: z.number().int().min(2).max(10).default(4),
  preferredExperience: z.string().optional().default('Any'),
  applicationDeadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid deadline date format',
  }),
  contactInfo: z.string().min(3, 'Contact information is required'),
});

const updateTeamSchema = createTeamSchema.partial();

const joinRequestSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(500),
});

module.exports = {
  createTeamSchema,
  updateTeamSchema,
  joinRequestSchema,
};
