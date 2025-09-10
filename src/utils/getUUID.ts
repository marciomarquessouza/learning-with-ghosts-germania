export const getUUID = () =>
  crypto?.randomUUID() || `${Date.now() + Math.random()}`;
