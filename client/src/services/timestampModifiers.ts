const timestampModifier = (timestamp: string | number | Date) =>
  new Date(timestamp).toLocaleDateString();

export const timestamps = {
  createdAt: timestampModifier,
  updatedAt: timestampModifier,
};
