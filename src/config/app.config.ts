export const EnvConfiguration = () => ({
  environtment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3001,
  limitByDefault: process.env.LIMIT_BY_DEFAULT || 10,
  offsetByDefault: process.env.OFFSET_BY_DEFAULT || 0,
});
