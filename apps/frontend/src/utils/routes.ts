export const routes = {
  home: "/",
  about: "/about",
  cityDetails: (citySlug: string) => `/cities/${citySlug}`,
};

// TODO: Extend shared route helpers as dashboard and data exploration routes are introduced.
