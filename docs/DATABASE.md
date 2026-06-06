# Database Design & Strategy

## 1. Overview
The database for HT-Care is powered by **Supabase (PostgreSQL)** and managed through **Prisma ORM**. The structure focuses on managing HT inventory, borrowers, and transaction histories securely and efficiently.

## 2. Core Entities & Schema (Prisma)

### 2.1 User (Authentication & RBAC)
Handles system access via NextAuth.
- `id`: String (UUID, Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum `UserRole` (SUPERADMIN, ADMIN, OPERATOR)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2.2 HT_Item (Inventory)
Represents a single Handy Talky unit.
- `id`: String (UUID, Primary Key)
- `ht_code`: String (Unique, e.g., "HT-001")
- `brand_type`: String (e.g., "Baofeng UV-5R")
- `condition`: Enum `HTCondition` (GOOD, BROKEN)
- `status`: Enum `HTStatus` (AVAILABLE, BORROWED)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2.3 Borrower (Peminjam)
Represents personnel or entities that can borrow HTs.
- `id`: String (UUID, Primary Key)
- `borrower_code`: String (Unique, e.g., "P-001")
- `full_name`: String
- `department`: String (e.g., "Keamanan", "Logistik")
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2.4 Transaction (Log Peminjaman)
Records the borrow and return events.
- `id`: String (UUID, Primary Key)
- `ht_id`: String (Foreign Key -> HT_Item)
- `borrower_id`: String (Foreign Key -> Borrower)
- `borrow_time`: DateTime
- `return_time`: DateTime (Nullable)
- `status`: Enum `TransactionStatus` (BORROWED, RETURNED)
- `operator_id`: String (Foreign Key -> User, the one who processed the scan)
- `createdAt`: DateTime

## 3. Environment Configurations
Database connections must be strictly maintained via `.env`:
```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[db]?schema=public"
DIRECT_URL="postgresql://[user]:[password]@[host]:[port]/[db]?schema=public"
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..."
```
*(Never commit `.env` or hardcode credentials).*

## 4. Prisma Operations Workflow
- **Generate Client**: `npx prisma generate` (Creates the typed client after schema changes).
- **Push Schema**: `npx prisma db push` (Sync schema to DB without migrations - ideal for early dev).
- **Migrations**: `npx prisma migrate dev` (Create and apply migration files - for production environments).
- **GUI Management**: `npx prisma studio` (Local database viewer).
