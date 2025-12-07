// Mock user database
export const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In real app, this would be hashed
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "admin",
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "user",
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
];
