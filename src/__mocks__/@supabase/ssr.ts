export const createBrowserClient = () => {
  return {
    // mockea aquí los métodos que usas, por ejemplo:
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      insert: async () => ({ data: null, error: null }),
    }),
    auth: {
      // mock auth methods si los usas
    },
  };
};
