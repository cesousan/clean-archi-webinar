export const extractToken = (authHeader: string): string | null => {
  const [type, token] = authHeader.split(' ');
  if (type !== 'Basic') return null;
  return token;
};
