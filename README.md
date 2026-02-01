# LuMa - Spotify for Recipes

A production-ready, full-stack recipe and meal-planning web application that helps users discover recipes, plan weekly meals, and generate smart grocery lists.

## 🎯 Core Features

- **Recipe Discovery Feed**: Tinder-style swipe interface to discover and like recipes
- **Personalized Recommendations**: AI-powered recipe suggestions based on dietary preferences
- **Weekly Meal Planning**: Drag-and-drop meal planner with auto-generation
- **Smart Grocery Lists**: Automatically aggregated and categorized shopping lists
- **Recipe Import**: Import recipes from URLs (stub - ready for integration)
- **Collections**: Curated recipe collections (Quick Meals, Healthy, Italian, etc.)
- **User Profiles**: Dietary patterns, allergies, cuisines, health goals

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Validation**: Zod
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── recipes/        # Recipe CRUD & search
│   │   ├── meal-plans/     # Meal planning
│   │   ├── grocery-lists/  # Grocery list management
│   │   └── collections/    # Recipe collections
│   ├── auth/               # Sign in/up pages
│   ├── dashboard/          # User dashboard
│   ├── onboarding/         # Onboarding flow
│   ├── recipes/            # Recipe pages
│   ├── planner/            # Meal planner
│   ├── grocery-list/       # Grocery list view
│   └── collections/        # Collections browser
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── recipes/           # Recipe-specific components
│   ├── planner/           # Meal planner components
│   └── grocery/           # Grocery list components
├── lib/                   # Core utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── validations.ts    # Zod schemas
├── prisma/               # Database
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── services/            # Business logic
│   ├── recipeImporter.ts      # URL recipe import (stub)
│   ├── ocrService.ts          # Photo OCR (stub)
│   ├── mealPlanGenerator.ts   # Meal plan algorithm
│   ├── groceryAggregator.ts   # Grocery list aggregation
│   ├── instacartService.ts    # Instacart integration (stub)
│   └── nutritionCalculator.ts # Nutrition calculations
├── utils/               # Helper functions
└── docker-compose.yml   # Docker setup
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- npm or yarn

### Local Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd skills-copilot-codespaces-vscode
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/luma?schema=public"
NEXTAUTH_SECRET="your-secret-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
INSTACART_API_KEY="your-instacart-api-key"
```

4. **Start PostgreSQL** (Option A: Docker)

```bash
docker-compose up -d postgres
```

Or (Option B: Local PostgreSQL)
- Ensure PostgreSQL is running locally
- Create database: `createdb luma`

5. **Run database migrations**

```bash
npm run prisma:migrate
```

6. **Seed the database**

```bash
npm run db:seed
```

7. **Start the development server**

```bash
npm run dev
```

8. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

Run the entire stack with Docker:

```bash
docker-compose up -d
```

Then run migrations and seed:

```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
```

## 🎮 User Journey

### Cold Start Flow

1. **Sign Up** → Create account with email/password
2. **Onboarding** → Set dietary preferences, cuisines, health goals
3. **Recipe Feed** → Swipe through personalized recipes (like/dislike)
4. **Generate Meal Plan** → Auto-generate weekly meal plan based on liked recipes
5. **View Planner** → See weekly meal calendar, swap meals as needed
6. **Generate Grocery List** → Get aggregated, categorized shopping list
7. **Shop** → Check off items or export to Instacart (stub)

### Demo Credentials

```
Email: demo@luma.app
Password: password123
```

## 📊 Database Schema

### Core Models

- **User**: Authentication and profile
- **UserProfile**: Dietary preferences, allergies, household info
- **Recipe**: Title, ingredients, steps, nutrition, tags
- **MealPlan**: Weekly meal planning
- **MealSlot**: Individual meal in a plan
- **GroceryList**: Shopping list for a meal plan
- **Collection**: Curated recipe collections

See `prisma/schema.prisma` for complete schema.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in (handled by NextAuth)

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Recipes
- `GET /api/recipes` - List recipes (paginated)
- `POST /api/recipes` - Create recipe
- `GET /api/recipes/:id` - Get recipe details
- `GET /api/recipes/search` - Search recipes
- `GET /api/recipes/feed` - Personalized feed
- `POST /api/recipes/:id/preference` - Like/dislike recipe
- `POST /api/recipes/import` - Import from URL

### Meal Plans
- `GET /api/meal-plans` - List user's meal plans
- `POST /api/meal-plans` - Generate new meal plan
- `GET /api/meal-plans/:id` - Get meal plan details
- `POST /api/meal-plans/:id/generate` - Regenerate meal slot

### Grocery Lists
- `GET /api/grocery-lists/:mealPlanId` - Get grocery list
- `PUT /api/grocery-lists/:mealPlanId` - Update items

### Collections
- `GET /api/collections` - List featured collections
- `GET /api/collections/:id` - Get collection details

## 🧪 Testing

Run tests:

```bash
npm test
```

## 🔧 Development Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run db:seed          # Seed database
```

## 🚢 Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Connect PostgreSQL database (Vercel Postgres, Supabase, or Neon)
5. Deploy

### Other Platforms

- **Render**: Use `render.yaml` for infrastructure as code
- **Railway**: Connect GitHub repo and add PostgreSQL
- **DigitalOcean**: Deploy with App Platform
- **AWS**: Use Amplify or EC2 with RDS

### Environment Variables for Production

```env
DATABASE_URL=<your-production-database-url>
NEXTAUTH_SECRET=<secure-random-string-min-32-chars>
NEXTAUTH_URL=<your-production-url>
INSTACART_API_KEY=<actual-instacart-api-key>
```

## 🔮 Future Integrations

### Stub Services (Ready for Integration)

1. **Recipe Importer** (`services/recipeImporter.ts`)
   - Integrate with Recipe Scrapers API
   - Parse HTML from recipe websites
   - Extract structured recipe data

2. **OCR Service** (`services/ocrService.ts`)
   - Google Cloud Vision API
   - AWS Textract
   - Azure Computer Vision
   - Extract recipes from cookbook photos

3. **Instacart Integration** (`services/instacartService.ts`)
   - Instacart Partner API
   - Search products, create carts
   - Generate checkout URLs
   - One-click grocery ordering

### Planned Features

- [ ] AI-powered recipe recommendations (OpenAI/Anthropic)
- [ ] Nutrition tracking and insights
- [ ] Social features (share recipes, follow users)
- [ ] Recipe ratings and reviews
- [ ] Cook mode (step-by-step timer)
- [ ] Voice commands
- [ ] Mobile app (React Native)
- [ ] Recipe scaling calculator
- [ ] Leftover management
- [ ] Budget tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Recipe data and images from Unsplash
- Inspired by Spotify's recommendation algorithm
- Built with Next.js, Prisma, and Tailwind CSS

---

**LuMa V1** - Making meal planning delightful ✨

For questions or support, please open an issue on GitHub.
