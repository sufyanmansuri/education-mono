export type User = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  title: string;
};

export type Role = "institute-admin" | "super-admin" | "teacher";
