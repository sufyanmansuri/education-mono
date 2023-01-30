import type { Institute } from "./Institute";
import type { Role } from "./User";

export type Query = {
  page: number;
  perPage: number;
  totalCount: number;
  sortBy: string;
  query: {
    search?: string;
    institute?: Institute[];
    type?: string[];
    level?: string[];
    role?: Role[];
    examBoard?: string[];
    approved?: boolean;
    verified?: boolean;
    keyStage?: string[];
  };
  totalPages: number;
  order: number;
  fields: string[];
  allFields: string[];
  fetch: boolean;
};
