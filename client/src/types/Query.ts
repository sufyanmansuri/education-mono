import type { Role } from "./User";

export type Query = {
  page: number;
  perPage: number;
  totalCount: number;
  sortBy: string;
  query: {
    search?: string;
    institute?: string[];
    role?: Role[];
  };
  totalPages: number;
  order: number;
  fields: string[];
  allFields: string[];
  fetch: boolean;
};
