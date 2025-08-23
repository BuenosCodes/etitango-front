# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### `npm run bootstrap`

Initializes the development environment by:
1. Creating an admin user with email `admin@example.com` and password `admin123`
2. Adding superadmin and admin roles to the user
3. Creating a test event with all required fields
4. Associating the user as an admin of the test event

This script is useful for setting up a development environment quickly. **Note: Change the default credentials in production!**

### `npm run migrate`

Runs all pending database migrations. See the [Database Migrations](#database-migrations) section for more details.

### `npm run migrate:rollback`

Rolls back the last migration. You can specify a number to roll back multiple migrations.

### `npm run migrate:test`

Runs tests for the migration system.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# etitango-front

## Data Validation and Schema Management

This project uses Zod for schema validation and type safety. All data structures are defined with validation rules that are tightly coupled with their type definitions.

### Schema Structure

The schemas are defined in `src/shared/schemas.ts` and include:

- Event schemas (`etiEventSchema`, `etiEventFirestoreSchema`)
- User schemas (`userSchema`, `userFirestoreSchema`)
- Signup schemas (`signupSchema`, `signupFirestoreSchema`)

Each schema includes:
- Type validation
- Required field validation
- Custom validation rules
- Error messages
- Firestore conversion utilities

### Database Migrations

The project includes a migration system for managing database schema changes. Migrations are version-controlled and can be rolled back if needed.

#### Available Commands

```bash
# Run all pending migrations
npm run migrate

# Rollback the last migration
npm run migrate:rollback

# Rollback multiple migrations
npm run migrate:rollback 2

# Run migration tests
npm run migrate:test
```

#### Migration Structure

Migrations are stored in `src/migrations/` with the following naming convention:
- `XXX_description.ts` where XXX is a sequential number
- Each migration includes `up` and `down` functions
- Migrations are automatically ordered by version number

Example migration:
```typescript
export const addUserRoles: Migration = {
  version: 1,
  name: 'Add user roles to existing users',
  up: async (db: Firestore) => {
    // Migration logic
  },
  down: async (db: Firestore) => {
    // Rollback logic
  },
};
```

#### Migration State

The migration system maintains state in Firestore:
- `migrations` collection: Tracks current version
- `migration_errors` collection: Logs any migration errors

### Validation Rules

#### Event Validation
- Required fields: id, name, location, capacity, dates
- Numeric fields must be positive
- URLs must be valid
- Dates must be valid
- Arrays must not be empty
- Bank information must be complete
- Schedule must have title and activities
- Locations must have name and link

#### User Validation
- Required fields: email, name, country, DNI
- Email must be valid
- Phone number must be valid
- Food preferences must be valid enum
- Roles must be valid
- Admin status must be valid

#### Signup Validation
- Required fields: dates, help preferences, food preferences
- Dates must be valid
- Help preferences must be valid enum
- Food preferences must be valid enum
- Country must be valid
- Lodging preferences must be boolean

### Using Schemas in Code

```typescript
import { etiEventSchema, toFirestore } from './shared/schemas';

// Validate data
const result = etiEventSchema.safeParse(eventData);
if (!result.success) {
  console.error('Validation failed:', result.error);
  return;
}

// Convert to Firestore format
const firestoreData = toFirestore.etiEvent(result.data);

// Save to Firestore
await firestore.collection('events').add(firestoreData);
```

### Testing

The project includes comprehensive tests for:
- Schema validation
- Migration system
- Data conversion
- Error handling

Run tests with:
```bash
npm run migrate:test
```
