# Migration Plan: Mongoose to Prisma

## Overview
Migrate the todo-mongo application from Mongoose to Prisma ORM while maintaining all existing functionality.

## Prerequisites
- ✅ Prisma is already installed as a dependency
- MongoDB connection string available in `.env` file

---

## Step 1: Initialize Prisma
- [x] Run `npx prisma init --datasource-provider mongodb`
- [x] This will create:
  - `prisma/schema.prisma` file
  - `.env` file (or update existing one)
- [x] Verify `MONGODB_URI` environment variable is set in `.env`

---

## Step 2: Define Prisma Schema
- [x] Update `prisma/schema.prisma` with Todo model
- [x] Define the schema to match current Mongoose model:
  ```prisma
  model Todo {
    id      String   @id @default(auto()) @map("_id") @db.ObjectId
    content String
    date    DateTime @default(now())
  }
  ```
- [x] Note: Prisma uses `id` by default, but MongoDB uses `_id`

---

## Step 3: Generate Prisma Client
- [x] Run `npx prisma generate`
- [x] This creates the Prisma Client based on your schema
- [x] Prisma Client will be imported as: `import { PrismaClient } from '@prisma/client'`

---

## Step 4: Update Database Connection
- [x] Create new `prisma-client.js` file (or update `database.js`)
- [x] Initialize PrismaClient:
  ```javascript
  import { PrismaClient } from '@prisma/client'
  export const prisma = new PrismaClient()
  ```
- [x] Remove Mongoose connection code from `database.js`

---

## Step 5: Migrate Existing Data (Optional)
- [x] If you have existing data in MongoDB:
  - Run `npx prisma db pull` to introspect existing database
  - This will update your schema to match current database structure
  - Verify the schema matches your needs
  - Run `npx prisma generate` again

---

## Step 6: Update API Routes (`routes/api.js`)

### Replace imports:
- [x] Remove: `import mongoose from 'mongoose'`
- [x] Remove: `import Todo from "../models/Todo.js"`
- [x] Add: `import { prisma } from '../database.js'`

### Update each route:

#### POST /todo (Create)
- [x] Replace Mongoose code:
  ```javascript
  // OLD: new Todo(req.body).save()
  // NEW: 
  prisma.todo.create({
    data: req.body
  })
  ```

#### GET /todos (Read)
- [x] Replace Mongoose code:
  ```javascript
  // OLD: Todo.find(filter).sort({date:"descending"})
  // NEW:
  prisma.todo.findMany({
    where: {},  // empty filter for all
    orderBy: { date: 'desc' }
  })
  ```

#### PUT /todo/:id (Update)
- [x] Replace Mongoose code:
  ```javascript
  // OLD: Todo.findByIdAndUpdate(req.params.id, req.body, options)
  // NEW:
  prisma.todo.update({
    where: { id: req.params.id },
    data: req.body
  })
  ```

#### DELETE /todo/:id (Delete)
- [x] Replace Mongoose code:
  ```javascript
  // OLD: Todo.findByIdAndDelete(req.params.id)
  // NEW:
  prisma.todo.delete({
    where: { id: req.params.id }
  })
  ```

#### Connection Check Middleware
- [x] Update `connectionCheck` function:
  ```javascript
  // Replace mongoose.connection.readyState check
  // Use: await prisma.$connect() (MongoDB doesn't support $queryRaw)
  ```

---

## Step 7: Update Server.js
- [x] Import Prisma client in `server.js`
- [x] Add graceful shutdown for Prisma:
  ```javascript
  process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit()
  })
  ```

---

## Step 8: Remove Mongoose Files
- [x] Delete or archive `models/Todo.js` (no longer needed)
- [x] Mongoose has been replaced by Prisma in `database.js`
- [x] Remove Mongoose from dependencies (optional cleanup):
  ```bash
  npm uninstall mongoose
  ```
- [x] Update README.md to reference Prisma instead of Mongoose

---

## Step 9: Testing
- [x] Test CREATE: Add new todo items
- [x] Test READ: View all todos
- [x] Test UPDATE: Edit existing todos
- [x] Test DELETE: Remove todos
- [x] Test error handling (invalid IDs, network issues)
- [x] Verify date sorting works correctly
- [x] Check connection error handling

---

## Step 10: Update Package.json Scripts (Optional)
- [ ] Add Prisma-related scripts:
  ```json
  "scripts": {
    "start": "node --env-file=.env server.js",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "prisma:pull": "prisma db pull"
  }
  ```

---

## Key Differences: Mongoose vs Prisma

| Feature | Mongoose | Prisma |
|---------|----------|--------|
| Schema | JavaScript classes | Prisma Schema Language |
| Queries | Methods on models | `prisma.model.method()` |
| Type Safety | Minimal | Full TypeScript support |
| Auto-completion | Limited | Excellent |
| Validation | Schema-based | Type-based + custom |
| Relationships | Refs & populate | Native relations |

---

## Useful Prisma Commands
```bash
npx prisma init              # Initialize Prisma
npx prisma generate          # Generate Prisma Client
npx prisma studio            # Open visual database browser
npx prisma db pull           # Introspect existing database
npx prisma format            # Format schema file
```

---

## Notes & Considerations
- Prisma Client is auto-generated, so run `npx prisma generate` after schema changes
- MongoDB requires ObjectId for `_id` fields
- Prisma Studio provides a nice GUI for viewing/editing data
- Error messages in Prisma are generally more descriptive
- Prisma validates data at the type level (especially useful with TypeScript)

---

## Troubleshooting

### ✅ Fixed: Custom output path causing import errors
**Problem:** `SyntaxError: Named export 'PrismaClient' not found`
**Solution:** Remove custom `output` from schema generator and use default location
```prisma
generator client {
  provider = "prisma-client-js"
  // Remove: output = "../generated/prisma"
}
```

### ✅ Fixed: Empty database name error
**Problem:** `empty database name not allowed`
**Solution:** Add database name to connection string between host and query params
```
DATABASE_URL="mongodb+srv://user:pass@host/DATABASE_NAME?options"
```

### ✅ Fixed: MongoDB doesn't support $queryRaw
**Problem:** `The mongodb provider does not support $queryRaw`
**Solution:** Use `await prisma.$connect()` instead for connection checks

### ✅ Fixed: Frontend using _id instead of id
**Problem:** `Malformed ObjectID: provided hex string representation must be exactly 12 bytes, instead got: "undefined"`
**Solution:** Update frontend to use `todo.id` instead of `todo._id`
- Prisma returns the field as `id` in JavaScript, even though it's stored as `_id` in MongoDB
- Change `data-id="${todo._id}"` to `data-id="${todo.id}"` in `script.js`

---

## Rollback Plan (If Needed)
- Keep Mongoose code in git history
- MongoDB data remains unchanged during migration
- Can revert changes and reinstall Mongoose if issues arise 