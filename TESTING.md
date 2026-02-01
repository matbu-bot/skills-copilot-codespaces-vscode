# LuMa V1 Testing Documentation

## Overview
This document contains systematic test scenarios for all features in LuMa V1.

---

## Backend API Routes

### Authentication Routes

#### POST /api/auth/signup
**Preconditions:** None
**Steps:**
1. Send POST request with email and password
2. Verify user creation in database

**Expected Result:**
- 201 status code
- User record created
- Password hashed with bcrypt
- Returns user data (without password)

#### POST /api/auth/signin (NextAuth)
**Preconditions:** User exists in database
**Steps:**
1. Send credentials via NextAuth
2. Verify session creation

**Expected Result:**
- Session cookie set
- User authenticated
- Redirect to dashboard

#### POST /api/auth/signout
**Preconditions:** User authenticated
**Steps:**
1. Call signout endpoint
2. Verify session destroyed

**Expected Result:**
- Session cleared
- Redirect to home

---

### Profile Routes

#### GET /api/profile
**Preconditions:** User authenticated
**Steps:**
1. Make GET request with session
2. Verify profile data returned

**Expected Result:**
- 200 status code
- Returns user profile with dietary preferences, allergies, goals, household size, etc.

#### PUT /api/profile
**Preconditions:** User authenticated
**Steps:**
1. Send updated profile data
2. Verify database update

**Expected Result:**
- 200 status code
- Profile updated in database
- Returns updated profile

---

### Recipe Routes

#### GET /api/recipes
**Preconditions:** User authenticated
**Steps:**
1. Request user's recipes
2. Optional filters (tags, cuisine, dietary)

**Expected Result:**
- 200 status code
- Returns array of user's recipes
- Includes ingredients, steps, tags, nutrition

#### POST /api/recipes
**Preconditions:** User authenticated
**Steps:**
1. Send recipe data (title, ingredients, steps, tags, nutrition)
2. Verify creation

**Expected Result:**
- 201 status code
- Recipe created in database
- Returns created recipe with ID

#### GET /api/recipes/[id]
**Preconditions:** User authenticated, recipe exists
**Steps:**
1. Request specific recipe by ID
2. Verify data completeness

**Expected Result:**
- 200 status code
- Returns complete recipe details
- 404 if recipe not found or not owned by user

#### PUT /api/recipes/[id]
**Preconditions:** User authenticated, owns recipe
**Steps:**
1. Send updated recipe data
2. Verify update

**Expected Result:**
- 200 status code
- Recipe updated
- Returns updated recipe

#### DELETE /api/recipes/[id]
**Preconditions:** User authenticated, owns recipe
**Steps:**
1. Send DELETE request
2. Verify deletion

**Expected Result:**
- 204 status code
- Recipe removed from database
- Associated ingredients and steps deleted

#### POST /api/recipes/import
**Preconditions:** User authenticated
**Steps:**
1. Send URL to import
2. Verify stub populates recipe data

**Expected Result:**
- 200 status code
- Returns simulated recipe data from URL
- Data structure matches Recipe model

#### GET /api/recipes/search
**Preconditions:** User authenticated
**Steps:**
1. Send search query with filters
2. Verify filtered results

**Expected Result:**
- 200 status code
- Returns recipes matching filters
- Filters work for: tags, cuisine, dietary, ingredients

#### GET /api/recipes/feed
**Preconditions:** User authenticated, has profile
**Steps:**
1. Request recommendation feed
2. Verify personalization

**Expected Result:**
- 200 status code
- Returns recipes matching user preferences
- Excludes recipes with allergens
- Excludes already-liked/disliked recipes

#### POST /api/recipes/[id]/preference
**Preconditions:** User authenticated, recipe exists
**Steps:**
1. Send like/dislike preference
2. Verify RecipePreference created

**Expected Result:**
- 200 status code
- RecipePreference record created
- Recipe doesn't appear in feed again

---

### Meal Plan Routes

#### GET /api/meal-plans
**Preconditions:** User authenticated
**Steps:**
1. Request user's meal plans
2. Verify list returned

**Expected Result:**
- 200 status code
- Returns array of meal plans
- Each includes meal slots with recipes

#### POST /api/meal-plans
**Preconditions:** User authenticated
**Steps:**
1. Send meal plan creation request
2. Optionally specify week start date

**Expected Result:**
- 201 status code
- Creates empty meal plan
- Returns meal plan with empty slots

#### GET /api/meal-plans/[id]
**Preconditions:** User authenticated, owns meal plan
**Steps:**
1. Request specific meal plan
2. Verify complete data

**Expected Result:**
- 200 status code
- Returns meal plan with all slots
- Includes recipe details for filled slots

#### PUT /api/meal-plans/[id]
**Preconditions:** User authenticated, owns meal plan
**Steps:**
1. Update meal slots (add/remove recipes, lock meals)
2. Verify persistence

**Expected Result:**
- 200 status code
- Meal plan updated
- Returns updated plan

#### DELETE /api/meal-plans/[id]
**Preconditions:** User authenticated, owns meal plan
**Steps:**
1. Delete meal plan
2. Verify deletion

**Expected Result:**
- 204 status code
- Meal plan and slots deleted

#### POST /api/meal-plans/[id]/generate
**Preconditions:** User authenticated, owns meal plan, has recipes
**Steps:**
1. Request plan generation
2. Specify options (whole week, specific days)
3. Verify suggestion engine runs

**Expected Result:**
- 200 status code
- Empty slots filled with appropriate recipes
- Locked slots preserved
- Dietary constraints respected
- Time constraints considered

---

### Grocery List Routes

#### GET /api/grocery-lists/[mealPlanId]
**Preconditions:** User authenticated, owns meal plan
**Steps:**
1. Request grocery list for meal plan
2. Verify aggregation

**Expected Result:**
- 200 status code
- Returns grocery list with items
- Ingredients aggregated across recipes
- Items grouped by category
- Duplicate ingredients summed

#### PUT /api/grocery-lists/[mealPlanId]
**Preconditions:** User authenticated, owns meal plan, grocery list exists
**Steps:**
1. Update grocery items (check/uncheck, edit quantities)
2. Verify persistence

**Expected Result:**
- 200 status code
- Updates saved
- Returns updated list

---

### Collection Routes

#### GET /api/collections
**Preconditions:** None (public) or User authenticated
**Steps:**
1. Request featured collections
2. Verify list

**Expected Result:**
- 200 status code
- Returns array of featured collections
- Each includes recipe preview

#### GET /api/collections/[id]
**Preconditions:** None (public) or User authenticated
**Steps:**
1. Request specific collection
2. Verify complete data

**Expected Result:**
- 200 status code
- Returns collection with all recipes
- Recipes include full details

---

## Frontend Pages

### Public Pages

#### / (Landing Page)
**Preconditions:** None
**Steps:**
1. Navigate to homepage
2. Verify content and CTAs

**Expected Result:**
- Page loads without errors
- Shows "Get Started" and "Sign In" buttons
- Feature highlights visible

#### /auth/signup
**Preconditions:** Not authenticated
**Steps:**
1. Fill email and password fields
2. Submit form
3. Verify redirect

**Expected Result:**
- Form validation works
- User created on submit
- Redirects to /onboarding

#### /auth/signin
**Preconditions:** User exists
**Steps:**
1. Enter credentials
2. Submit
3. Verify redirect

**Expected Result:**
- Authentication successful
- Session created
- Redirects to /dashboard

---

### Protected Pages (Require Authentication)

#### /dashboard
**Preconditions:** User authenticated, has profile
**Steps:**
1. Navigate to dashboard
2. Verify personalized content

**Expected Result:**
- Shows user stats (liked recipes, meal plans)
- Shows dietary preferences
- Quick action links work
- Recent meal plans displayed

#### /onboarding
**Preconditions:** User authenticated, profile incomplete
**Steps:**
1. Navigate through onboarding steps
2. Fill dietary patterns, allergies, cuisines, time, household, goals
3. Submit

**Expected Result:**
- Multi-step form navigates correctly
- Data persists at each step
- Creates/updates UserProfile
- Redirects to /dashboard on completion

#### /recipes
**Preconditions:** User authenticated
**Steps:**
1. View recipe library
2. Test search and filters
3. Click recipe to view details

**Expected Result:**
- Lists user's recipes
- Filters work (cuisine, dietary, tags)
- Search by ingredient works
- Recipe cards show key info
- Can navigate to add/import

#### /recipes/add
**Preconditions:** User authenticated
**Steps:**
1. Fill recipe form (title, ingredients, steps, tags, nutrition)
2. Submit

**Expected Result:**
- Form validation works
- Recipe created
- Redirects to recipe detail or library

#### /recipes/import
**Preconditions:** User authenticated
**Steps:**
1. Paste recipe URL
2. Submit
3. Review populated data
4. Save

**Expected Result:**
- URL validation
- Stub service populates fields
- User can edit before saving
- Recipe created on save

#### /recipes/feed
**Preconditions:** User authenticated, has profile, recipes available
**Steps:**
1. View swipe feed
2. Swipe left (dislike) or right (like)
3. Verify preferences saved

**Expected Result:**
- Shows recipe cards one at a time
- Swipe gestures work
- Like/dislike creates RecipePreference
- Next recipe shown after swipe
- No recipes with allergens shown

#### /planner
**Preconditions:** User authenticated, has recipes
**Steps:**
1. View meal planner board
2. Create or select meal plan
3. Drag recipe to slot
4. Lock a meal
5. Generate week
6. Regenerate specific day

**Expected Result:**
- Calendar grid displays (Mon-Sun, B/L/D)
- Drag-and-drop works
- Locked meals have visual indicator
- Generate fills empty slots
- Regenerate respects locks
- Dietary constraints enforced

#### /grocery-list/[mealPlanId]
**Preconditions:** User authenticated, has meal plan with recipes
**Steps:**
1. View grocery list
2. Verify aggregation
3. Check/uncheck items
4. Edit quantities
5. Verify persistence

**Expected Result:**
- Items grouped by category
- Quantities aggregated correctly
- Checkboxes toggle state
- Edits save
- "Already have" items visually distinguished

#### /collections
**Preconditions:** User authenticated or public
**Steps:**
1. Browse featured collections
2. Click collection to view details

**Expected Result:**
- Collections display with images
- Click navigates to detail page
- Collection recipes shown

#### /collections/[id]
**Preconditions:** User authenticated or public, collection exists
**Steps:**
1. View collection details
2. Click "Add to Week" if authenticated
3. Verify recipes added to planner

**Expected Result:**
- Shows all recipes in collection
- "Add to Week" creates/updates meal plan
- Redirects to /planner

---

## Smoke Test Execution Log

### Session: [DATE]
- [ ] All API routes return appropriate status codes
- [ ] All protected routes require authentication
- [ ] All pages load without console errors
- [ ] Critical user journeys work end-to-end
- [ ] Data persists correctly across operations

---

## Edge Cases to Test

### Authentication
- [ ] Duplicate email registration
- [ ] Invalid credentials
- [ ] Session expiry
- [ ] Concurrent sessions

### Recipe Operations
- [ ] Empty recipe library
- [ ] Recipe with no ingredients
- [ ] Recipe with no steps
- [ ] Very long ingredient lists
- [ ] Special characters in recipe data

### Meal Planning
- [ ] No recipes available
- [ ] Only 1-2 recipes available
- [ ] All slots locked
- [ ] Conflicting dietary constraints
- [ ] Zero matching recipes for constraints

### Grocery Lists
- [ ] Empty meal plan
- [ ] Single recipe
- [ ] Duplicate ingredients with different units
- [ ] Very large quantities

### Collections
- [ ] Empty collection
- [ ] Collection with unavailable recipes

---

## Performance Benchmarks

### Target Metrics
- Page load: < 2s
- API response: < 500ms
- Meal plan generation: < 3s
- Grocery list generation: < 2s

### Load Testing
- [ ] 100 concurrent users
- [ ] 1000 recipes in library
- [ ] 50 meal plans per user
- [ ] Large grocery lists (100+ items)

---

## Security Checklist

- [ ] All protected routes check authentication
- [ ] Users can only access their own data
- [ ] Passwords properly hashed
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] CSRF protection enabled
- [ ] Environment variables not exposed
- [ ] No sensitive data in client-side code
- [ ] Input validation on all forms
- [ ] Rate limiting on auth endpoints
