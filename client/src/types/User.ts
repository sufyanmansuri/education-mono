export type User = {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  title: string;
  institute?: string;
};

export type Role = "institute-admin" | "super-admin" | "teacher";
