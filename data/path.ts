export const AUTH_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
};

export const PROTECTED_PATHS = {
  TABLES: {
    INDEX: "/tables",
    CREATE: "/tables/create",
    EDIT: (id: string) => `/tables/${id}/edit`,
  },
  MENU: {
    CATEGORIES: {
      INDEX: "/menu/categories",
    },
    ITEMS: {
      INDEX: "/menu/items",
    },
  },
};

export const PUBLIC_PATHS = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
};

// All paths combined for easy access
export const PATHS = {
  ...AUTH_PATHS,
  ...PROTECTED_PATHS,
  ...PUBLIC_PATHS,
};
