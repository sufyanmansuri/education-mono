export type ServiceFunction = (
  query: any,
  injectDefaultQuery?: boolean
) => Promise<{
  data: any;
  error: unknown;
}>;
