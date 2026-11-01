import z from "zod";


const taskSchema = z.object({
  task: z
    .string()
    .min(2, "Task should be at least 2 characters.")
    .max(30, "Task should not exceed 30 characters."),

  note: z
    .string()
    .min(5, "Note should be at least 5 characters.")
    .max(600, "Note should not exceed 600 characters.")
    .optional(),

  category: z
    .string()
    .optional(),

  priority: z
    .enum(["high", "medium", "low"],
          {error: "Invalid priority. Choose high, medium, or low.", })
    .default("medium"),

  date: z.iso.date({
        error: 'Please select a valid date.'
    }),

  time: z.iso.time({
        error: 'Please select a valid time.'
    }),

  isCompleted: z.boolean().default(false)
});

export const updateTaskSchema = taskSchema.partial();

export default taskSchema;

