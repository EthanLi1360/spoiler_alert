# Spoiler Alert v0 - Front-End Documentation

## Overview

Spoiler Alert is a comprehensive fridge management application that helps users track their groceries, find recipes based on what's in their fridge, and manage shopping lists. This documentation outlines the core functionality and structure of the front-end application.

## Core Pages & Components

### 1. Authentication

- **Login Page** (`/login`)

  - Username/password login functionality
  - Saves authentication token in localStorage
  - Redirects to homepage on successful login

- **Signup Page** (`/signup`)
  - Create new account with username and password
  - Auto-login after successful signup
  - Redirects to homepage after account creation

### 2. Fridge Management

- **Fridge Page** (`/fridge`)

  - Lists all fridges the user has access to
  - Displays all food items in the selected fridge
  - Add new items to the fridge with name, quantity, and expiration date
  - Edit or remove existing items
  - Create/manage multiple fridges
  - Share fridges with other users

- **Fridge Spinner Component**
  - Visual selection interface for multiple fridges
  - Saves selected fridge in localStorage for persistence
  - Create new fridges directly from the spinner

### 3. Recipes

- **Recipes Page** (`/recipes`)

  - Generate recipe suggestions based on fridge contents
  - Save favorite recipes
  - View recipe details (ingredients, instructions)
  - Integration with Gemini AI API for recipe generation

- **Recipe Details Component**
  - Expanded view of recipe ingredients and instructions
  - Handles both saved recipes and generated recipes with different data structures

### 4. Wishlist/Shopping List

- **Wishlist Page** (`/wishlist`)
  - Create and manage multiple shopping lists
  - Add, edit, and remove items from lists
  - Import ingredients from recipes
  - Select/deselect items when shopping
  - Associate wishlists with specific fridges

## Data Flow & State Management

- Local state management using React hooks
- Persistent storage using localStorage for:
  - Authentication tokens
  - Selected fridge ID
  - User preferences
- Backend communication via axios for:
  - User authentication
  - CRUD operations on fridges, items, recipes, and wishlists
  - AI-powered recipe generation

## API Integration

### Backend Endpoints

1. **Authentication**

   - `/try_login` - Authenticates user credentials
   - `/add_credentials` - Creates new user account

2. **Fridge Management**

   - `/get_fridges` - Fetches all fridges for a user
   - `/add_fridge` - Creates a new fridge
   - `/get_fridge_contents` - Gets all items in a fridge
   - `/add_fridge_item` - Adds item to fridge
   - `/update_fridge_item` - Updates item details
   - `/delete_fridge_item` - Removes item from fridge

3. **Recipes**

   - `/save_recipe` - Saves a recipe to the database
   - `/view_saved_recipes` - Gets all saved recipes for a fridge
   - `/delete_recipe` - Removes a saved recipe

4. **Wishlist**
   - `/get_wishlists` - Fetches all wishlists for a fridge
   - `/create_wishlist` - Creates a new wishlist
   - `/get_wishlist_items` - Gets all items in a wishlist
   - `/add_wishlist_item` - Adds item to wishlist
   - `/update_wishlist_item` - Updates wishlist item
   - `/delete_wishlist_item` - Removes item from wishlist
   - `/add_all_recipe_ingredients_to_wishlist` - Imports recipe ingredients

### External APIs

- **Gemini AI API** - Used for recipe generation based on available ingredients

## Front-End Technology Stack

- **Framework**: React
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: CSS Modules
- **UI Components**: Material-UI icons and custom components

## Prompting Examples

When requesting front-end changes, use the following format for clarity:

```
Feature: [Feature Name]
Description: [Brief description of the feature or change]
Pages Affected: [List of pages/components that need modification]
Expected Behavior: [How should the feature work]
Data Requirements: [Any new data structures or API endpoints needed]
```

### Examples:

```
Feature: Dark Mode Toggle
Description: Add a toggle button to switch between light and dark theme
Pages Affected: Navbar, global styles
Expected Behavior: Toggle persists between sessions, changes all UI elements
Data Requirements: New localStorage entry for theme preference
```

```
Feature: Recipe Filtering
Description: Allow users to filter recipes by cuisine type or dietary restrictions
Pages Affected: Recipes page, RecipeBanners component
Expected Behavior: Display filter options above recipe list, show only matching recipes
Data Requirements: Recipe objects need cuisine and dietary restriction properties
```

## Development Guidelines

1. **Component Structure**:

   - Create reusable components in their own folders with CSS modules
   - Keep page components focused on layout and data fetching
   - Extract business logic into hooks or utility functions

2. **State Management**:

   - Use React Context for global state where appropriate
   - Keep form state local to components
   - Use useEffect for data fetching and side effects

3. **Styling**:

   - Use CSS modules for component-specific styles
   - Maintain consistent color palette and spacing
   - Design for mobile-first, then adapt to larger screens

4. **Error Handling**:
   - Display user-friendly error messages
   - Gracefully handle API failures
   - Provide fallbacks for missing data

## Roadmap

Planned features for future versions:

1. Enhanced recipe recommendations based on user preferences
2. Barcode scanning for adding items to fridges
3. Meal planning calendar
4. Nutritional information tracking
5. Expiration date alerts and notifications
6. Social sharing of recipes and shopping lists
