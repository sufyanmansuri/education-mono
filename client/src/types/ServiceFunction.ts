export type ServiceFunction = (query: any) => Promise<{
  data: any;
  error: unknown;
}>;
