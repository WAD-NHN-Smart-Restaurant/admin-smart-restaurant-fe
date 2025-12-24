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

// Mock tables database
export const mockTables = [
  {
    id: "1",
    tableNumber: "T-001",
    capacity: 4,
    location: "Indoor",
    description: "Window seat with city view",
    status: "occupied" as const,
    qrToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZUlkIjoiMSIsInJlc3RhdXJhbnRJZCI6IjEiLCJpYXQiOjE3MDMxMjAwMDB9.mock",
    qrTokenCreatedAt: new Date("2024-12-15").toISOString(),
    qrCodeUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    createdAt: new Date("2024-11-01").toISOString(),
    updatedAt: new Date("2024-12-15").toISOString(),
  },
  {
    id: "2",
    tableNumber: "T-002",
    capacity: 2,
    location: "Indoor",
    description: "Cozy corner table",
    status: "inactive" as const,
    qrToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZUlkIjoiMiIsInJlc3RhdXJhbnRJZCI6IjEiLCJpYXQiOjE3MDMxMjAwMDB9.mock",
    qrTokenCreatedAt: new Date("2024-12-15").toISOString(),
    qrCodeUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    createdAt: new Date("2024-11-01").toISOString(),
    updatedAt: new Date("2024-12-15").toISOString(),
  },
  {
    id: "3",
    tableNumber: "T-003",
    capacity: 6,
    location: "Outdoor",
    description: "Large patio table perfect for groups",
    status: "available" as const,
    qrToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZUlkIjoiMyIsInJlc3RhdXJhbnRJZCI6IjEiLCJpYXQiOjE3MDMxMjAwMDB9.mock",
    qrTokenCreatedAt: new Date("2024-12-10").toISOString(),
    qrCodeUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    createdAt: new Date("2024-11-02").toISOString(),
    updatedAt: new Date("2024-12-10").toISOString(),
  },
  {
    id: "4",
    tableNumber: "VIP-01",
    capacity: 8,
    location: "VIP Room",
    description: "Private dining room with chandelier",
    status: "occupied" as const,
    qrToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZUlkIjoiNCIsInJlc3RhdXJhbnRJZCI6IjEiLCJpYXQiOjE3MDMxMjAwMDB9.mock",
    qrTokenCreatedAt: new Date("2024-12-12").toISOString(),
    qrCodeUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    createdAt: new Date("2024-11-03").toISOString(),
    updatedAt: new Date("2024-12-12").toISOString(),
  },
  {
    id: "5",
    tableNumber: "T-004",
    capacity: 4,
    location: "Patio",
    description: "Garden view seating",
    status: "inactive" as const,
    qrToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZUlkIjoiNSIsInJlc3RhdXJhbnRJZCI6IjEiLCJpYXQiOjE3MDMxMjAwMDB9.mock",
    qrTokenCreatedAt: new Date("2024-12-01").toISOString(),
    qrCodeUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    createdAt: new Date("2024-11-05").toISOString(),
    updatedAt: new Date("2024-12-01").toISOString(),
  },
  {
    id: "6",
    tableNumber: "T-005",
    capacity: 2,
    location: "Balcony",
    description: "Romantic balcony seating",
    status: "available" as const,
    qrToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZUlkIjoiNiIsInJlc3RhdXJhbnRJZCI6IjEiLCJpYXQiOjE3MDMxMjAwMDB9.mock",
    qrTokenCreatedAt: new Date("2024-12-14").toISOString(),
    qrCodeUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    createdAt: new Date("2024-11-08").toISOString(),
    updatedAt: new Date("2024-12-14").toISOString(),
  },
  {
    id: "7",
    tableNumber: "T-006",
    capacity: 4,
    location: "Main Hall",
    description: "Central location, easy access",
    status: "available" as const,
    createdAt: new Date("2024-11-10").toISOString(),
    updatedAt: new Date("2024-11-10").toISOString(),
  },
  {
    id: "8",
    tableNumber: "T-007",
    capacity: 10,
    location: "Garden",
    description: "Large outdoor garden table for events",
    status: "occupied" as const,
    qrToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZUlkIjoiOCIsInJlc3RhdXJhbnRJZCI6IjEiLCJpYXQiOjE3MDMxMjAwMDB9.mock",
    qrTokenCreatedAt: new Date("2024-12-11").toISOString(),
    qrCodeUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    createdAt: new Date("2024-11-12").toISOString(),
    updatedAt: new Date("2024-12-11").toISOString(),
  },
];
