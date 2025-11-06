import { z } from "zod";

export const SearchSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
});
