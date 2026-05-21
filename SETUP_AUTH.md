# ==============================================
# HCMS BNI - Setup & Installation Guide
# ==============================================

## Prerequisites

1. Node.js 18+
2. PostgreSQL 14+
3. Git

## Installation Steps

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/hcms_bni"

# Generate AUTH_SECRET
openssl rand -base64 32
# Add the generated key to AUTH_SECRET in .env
```

### 3. Database Setup

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed initial data (creates users!)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Access the Application

- **URL:** http://localhost:3000
- **Login:** http://localhost:3000/login

## Demo Credentials

After running `npm run db:seed`:

| Role    | Email                        | Password   |
|---------|------------------------------|------------|
| Admin   | admin@bnifinance.co.id       | admin123   |
| Employee| joko.susilo@bnifinance.co.id | password123|

## Features Implemented in Session 1

### Authentication & Session
- [x] NextAuth v5 (beta) integration
- [x] Credentials provider with email/password
- [x] JWT-based sessions (8 hours)
- [x] SessionProvider wrapper
- [x] Protected routes with middleware
- [x] Role-based access control (ADMIN, MANAGER, EMPLOYEE)
- [x] Admin-only route protection
- [x] Login page with validation
- [x] Sign out functionality
- [x] User profile in header (dynamic from session)
- [x] Dashboard with user session data

### Database
- [x] User model for authentication
- [x] Account model (NextAuth adapter)
- [x] Session model
- [x] VerificationToken model
- [x] UserRole enum (SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE)
- [x] User-Employee relationship

### API Routes
- [x] `/api/auth/[...nextauth]` - NextAuth handlers
- [x] `/api/dashboard/stats` - Dashboard statistics (authenticated)

### Components
- [x] SessionProvider
- [x] Skeleton loading components
- [x] Updated Header with session integration
- [x] Updated Dashboard with session data

## Next Sessions (To Do)

1. **Session 2:** Replace Mock Data with API Integration
2. **Session 3:** Remove Console.log Debug Statements
3. **Session 4:** Add Loading States & Skeletons
4. **Session 5:** Add Error Boundaries & Toast Notifications
5. **Session 6:** Add Revalidation & Cache Invalidation

## Troubleshooting

### "Cannot find module 'bcryptjs'"
```bash
npm install bcryptjs @types/bcryptjs
```

### "Prisma client not generated"
```bash
npm run db:generate
```

### "Database connection failed"
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify database exists

### "Invalid credentials" after seeding
```bash
npm run db:seed
```
This will create/update the demo users.