// Mock data storage for development
import { Category, CategoryStatus } from "@/types/category-type";
import { Table } from "@/types/table-type";
import {
  MenuItem,
  MenuItemPhoto,
  MenuItemStatus,
} from "@/types/menu-item-type";

// Categories Mock Data
const _categoriesData: Category[] = [
  {
    id: "cat-1",
    name: "Appetizers",
    description: "Start your meal with our delicious appetizers",
    displayOrder: 1,
    status: CategoryStatus.ACTIVE,
    itemCount: 8,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "cat-2",
    name: "Main Courses",
    description: "Our signature main dishes",
    displayOrder: 2,
    status: CategoryStatus.ACTIVE,
    itemCount: 15,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "cat-3",
    name: "Desserts",
    description: "Sweet endings to your meal",
    displayOrder: 3,
    status: CategoryStatus.ACTIVE,
    itemCount: 6,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "cat-4",
    name: "Beverages",
    description: "Hot and cold drinks",
    displayOrder: 4,
    status: CategoryStatus.ACTIVE,
    itemCount: 12,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "cat-5",
    name: "Seasonal Special",
    description: "Limited time seasonal dishes",
    displayOrder: 5,
    status: CategoryStatus.INACTIVE,
    itemCount: 3,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "cat-6",
    name: "Salads",
    description: "Fresh and healthy salad options",
    displayOrder: 6,
    status: CategoryStatus.ACTIVE,
    itemCount: 5,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
];

// Export mutable reference for API functions
export const categories = [..._categoriesData];
export const getCategories = () => categories;

// Helper function to generate new ID
export const generateId = () =>
  `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper functions for category operations
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};

export const addCategory = (
  category: Omit<Category, "id" | "createdAt" | "updatedAt">,
): Category => {
  const newCategory: Category = {
    ...category,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  categories.push(newCategory);
  return newCategory;
};

export const updateCategory = (
  id: string,
  updates: Partial<Omit<Category, "id" | "createdAt">>,
): Category | null => {
  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) return null;

  categories[index] = {
    ...categories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return categories[index];
};

export const deleteCategory = (id: string): boolean => {
  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) return false;

  categories.splice(index, 1);
  return true;
};

// Existing tables data (if any) - keeping compatibility
export const tables: Table[] = [];

// Menu Items Mock Data
const _menuItemsData: MenuItem[] = [
  {
    id: "item-1",
    name: "Caesar Salad",
    categoryId: "cat-1",
    categoryName: "Appetizers",
    price: 12.99,
    description:
      "Fresh romaine lettuce with parmesan cheese, croutons, and our signature Caesar dressing",
    prepTime: 10,
    status: MenuItemStatus.ACTIVE,
    isChefRecommendation: true,
    popularity: 85,
    photos: [
      {
        id: "photo-1",
        menuItemId: "item-1",
        url: "/images/menu/caesar-salad.jpg",
        filename: "caesar-salad.jpg",
        size: 245760,
        mimeType: "image/jpeg",
        isPrimary: true,
        createdAt: "2024-01-01T10:00:00Z",
      },
    ],
    primaryPhoto: {
      id: "photo-1",
      menuItemId: "item-1",
      url: "/images/menu/caesar-salad.jpg",
      filename: "caesar-salad.jpg",
      size: 245760,
      mimeType: "image/jpeg",
      isPrimary: true,
      createdAt: "2024-01-01T10:00:00Z",
    },
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "item-2",
    name: "Grilled Salmon",
    categoryId: "cat-2",
    categoryName: "Main Courses",
    price: 28.99,
    description:
      "Fresh Atlantic salmon grilled to perfection with lemon butter sauce",
    prepTime: 25,
    status: MenuItemStatus.ACTIVE,
    isChefRecommendation: true,
    popularity: 92,
    photos: [
      {
        id: "photo-2",
        menuItemId: "item-2",
        url: "/images/menu/grilled-salmon.jpg",
        filename: "grilled-salmon.jpg",
        size: 312540,
        mimeType: "image/jpeg",
        isPrimary: true,
        createdAt: "2024-01-01T10:00:00Z",
      },
    ],
    primaryPhoto: {
      id: "photo-2",
      menuItemId: "item-2",
      url: "/images/menu/grilled-salmon.jpg",
      filename: "grilled-salmon.jpg",
      size: 312540,
      mimeType: "image/jpeg",
      isPrimary: true,
      createdAt: "2024-01-01T10:00:00Z",
    },
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "item-3",
    name: "Chocolate Lava Cake",
    categoryId: "cat-3",
    categoryName: "Desserts",
    price: 9.99,
    description:
      "Warm chocolate cake with molten chocolate center, served with vanilla ice cream",
    prepTime: 15,
    status: MenuItemStatus.ACTIVE,
    isChefRecommendation: false,
    popularity: 78,
    photos: [],
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "item-4",
    name: "Truffle Risotto",
    categoryId: "cat-2",
    categoryName: "Main Courses",
    price: 34.99,
    description:
      "Creamy arborio rice with black truffle, parmesan, and white wine",
    prepTime: 30,
    status: MenuItemStatus.OUT_OF_STOCK,
    isChefRecommendation: true,
    popularity: 65,
    photos: [],
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "item-5",
    name: "Seasonal Soup",
    categoryId: "cat-5",
    categoryName: "Seasonal Special",
    price: 8.99,
    description: "Chef's special seasonal soup made with fresh ingredients",
    prepTime: 5,
    status: MenuItemStatus.INACTIVE,
    isChefRecommendation: false,
    popularity: 45,
    photos: [],
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
];

const menuItems = [..._menuItemsData];
let photoIdCounter = 3;

// Menu Items Helper Functions
export const getMenuItems = () => menuItems;

export const getMenuItemById = (id: string): MenuItem | undefined =>
  menuItems.find((item) => item.id === id);

export const createMenuItem = (
  data: Omit<
    MenuItem,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "popularity"
    | "photos"
    | "primaryPhoto"
    | "categoryName"
  >,
): MenuItem => {
  // Find category name
  const category = categories.find((cat) => cat.id === data.categoryId);
  const categoryName = category?.name || "Unknown Category";

  const newItem: MenuItem = {
    ...data,
    id: `item-${Date.now()}`,
    categoryName,
    popularity: 0,
    photos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  menuItems.push(newItem);
  return newItem;
};

export const updateMenuItem = (
  id: string,
  updates: Partial<MenuItem>,
): MenuItem | null => {
  const index = menuItems.findIndex((item) => item.id === id);
  if (index === -1) return null;

  // Update category name if categoryId changed
  if (updates.categoryId) {
    const category = categories.find((cat) => cat.id === updates.categoryId);
    updates.categoryName = category?.name || "Unknown Category";
  }

  menuItems[index] = {
    ...menuItems[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return menuItems[index];
};

export const deleteMenuItem = (id: string): boolean => {
  const index = menuItems.findIndex((item) => item.id === id);
  if (index === -1) return false;

  menuItems.splice(index, 1);
  return true;
};

export const addMenuItemPhoto = (
  menuItemId: string,
  photoData: Omit<MenuItemPhoto, "id" | "menuItemId" | "createdAt">,
): MenuItemPhoto | null => {
  const menuItem = menuItems.find((item) => item.id === menuItemId);
  if (!menuItem) return null;

  const newPhoto: MenuItemPhoto = {
    ...photoData,
    id: `photo-${++photoIdCounter}`,
    menuItemId,
    createdAt: new Date().toISOString(),
  };

  menuItem.photos.push(newPhoto);

  // If this is the first photo or marked as primary, set it as primary
  if (newPhoto.isPrimary || menuItem.photos.length === 1) {
    // Remove primary from other photos
    menuItem.photos.forEach((photo) => {
      photo.isPrimary = photo.id === newPhoto.id;
    });
    menuItem.primaryPhoto = newPhoto;
  }

  return newPhoto;
};

export const deleteMenuItemPhoto = (
  menuItemId: string,
  photoId: string,
): boolean => {
  const menuItem = menuItems.find((item) => item.id === menuItemId);
  if (!menuItem) return false;

  const photoIndex = menuItem.photos.findIndex((photo) => photo.id === photoId);
  if (photoIndex === -1) return false;

  const wasPrimary = menuItem.photos[photoIndex].isPrimary;
  menuItem.photos.splice(photoIndex, 1);

  // If deleted photo was primary, set first remaining photo as primary
  if (wasPrimary && menuItem.photos.length > 0) {
    menuItem.photos[0].isPrimary = true;
    menuItem.primaryPhoto = menuItem.photos[0];
  } else if (menuItem.photos.length === 0) {
    menuItem.primaryPhoto = undefined;
  }

  return true;
};

export const setPrimaryPhoto = (
  menuItemId: string,
  photoId: string,
): boolean => {
  const menuItem = menuItems.find((item) => item.id === menuItemId);
  if (!menuItem) return false;

  const photo = menuItem.photos.find((p) => p.id === photoId);
  if (!photo) return false;

  // Remove primary from all photos, set new primary
  menuItem.photos.forEach((p) => {
    p.isPrimary = p.id === photoId;
  });

  menuItem.primaryPhoto = photo;
  return true;
};
