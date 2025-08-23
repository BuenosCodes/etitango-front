# Test Plan for ETI Tango Frontend

## Authentication Components
- [x] withAuthentication.tsx
  - [x] Role-based access control
  - [x] Email verification checks
  - [x] Event-specific admin checks
  - [x] Auth state changes
- [x] ProtectedRoute.jsx
  - [x] Authentication state handling
  - [x] Redirect behavior
  - [x] Route props passing
  - [x] Loading state

## Core Components
- [x] ComboPricingDisplay.tsx
  - [x] Price formatting
  - [x] Order number calculations
  - [x] Context integration
  - [x] Empty state handling
- [x] SignupStatusDisplay.tsx
  - [x] Status display logic
  - [x] Receipt upload integration
  - [x] Reset signup functionality

## Sign In Module
- [x] SignIn.jsx
  - [x] Firebase integration
  - [x] Form validation
  - [x] Error handling
  - [x] Success redirect

## Home Module
- [x] Home.js
  - [x] Context integration
  - [x] Conditional rendering
  - [x] Image display
  - [x] Component composition

## Instructions Module
- [x] Instructions.tsx
  - [x] YouTube integration
  - [x] Layout rendering
  - [x] Responsive design
  - [x] Typography styling

## User Module
- [x] User.tsx
  - [x] Authentication integration
  - [x] Profile checks
  - [x] Role-based access
  - [x] Component composition

## SuperAdmin Module
- [x] SuperAdmin.tsx
  - [x] Role-based access
  - [x] Event management
  - [x] User management
  - [x] Data validation

## Inscripcion Module
- [x] Inscripcion.tsx
  - [x] Signup form logic
  - [x] Event validation
  - [x] Firebase handling
  - [x] Success/failure states

## Shared Components
- [x] FileUpload.tsx
  - [x] File handling
  - [x] Validation
  - [x] Error states
  - [x] Success feedback

## Integration Tests
- [x] User Registration Flow
  - [x] Form submission
  - [x] Firebase integration
  - [x] Email verification
  - [x] Success redirect
- [x] Login Process
  - [x] Authentication
  - [x] Session management
  - [x] Role-based redirects
  - [x] Error handling
- [x] Event Management
  - [x] CRUD operations
  - [x] Validation
  - [x] Access control
  - [x] Data persistence
- [x] Admin Operations
  - [x] User role management
  - [x] Event admin management
  - [x] Super admin operations
  - [x] Error handling

## Migration Tests
- [x] MigrationManager.test.ts
  - [x] Migration execution
  - [x] Error handling
  - [x] State management
- [x] addUserRoles migration
  - [x] Role assignment
  - [x] Data validation
  - [x] Error handling

## Test Implementation Guidelines

### Tools and Libraries
- Jest for test running and assertions
- React Testing Library for component testing
- Mock Service Worker for API mocking
- Firebase Emulator for Firebase testing

### Best Practices
1. Test component behavior, not implementation
2. Use meaningful test descriptions
3. Mock external dependencies
4. Test error states and edge cases
5. Maintain test isolation
6. Follow AAA pattern (Arrange, Act, Assert)

### Coverage Goals
- Component tests: 80% coverage
- Integration tests: 70% coverage
- Critical paths: 100% coverage
- Error handling: 90% coverage

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.tsx

# Run tests in watch mode
npm test -- --watch
```

# Test Failures and Fixes

## Mock Setup Issues

### Firebase Auth Mocks
- **Files Affected**: 
  - `src/modules/signIn/login.integration.test.jsx`
  - `src/modules/signIn/signIn.test.tsx`
  - `src/modules/signIn/signIn.test.jsx`
- **Error**: Cannot read properties of undefined (reading 'mockAuth')
- **Fix**: Ensure `mockAuth` is properly exported from the mocks directory and imported in the test files. Update the mock setup to:
  ```js
  import { mockAuth } from '../../__mocks__/firebase/auth';
  ```

### Firebase Firestore Mocks
- **Files Affected**:
  - `src/migrations/run.test.ts`
  - `src/modules/eventManagement/event.integration.test.tsx`
- **Error**: Cannot read properties of undefined (reading 'mockFirestore')
- **Fix**: Ensure `mockFirestore` is properly exported from the mocks directory and imported in the test files. Update the mock setup to:
  ```js
  import { mockFirestore } from '../../__mocks__/firebase';
  ```

### i18n Mocks
- **Files Affected**:
  - `src/modules/components/ComboPricingDisplay.test.tsx`
  - `src/modules/user/index.test.tsx`
- **Error**: Cannot read properties of undefined (reading 'mockI18n')
- **Fix**: Ensure `mockI18n` is properly exported from the mocks directory and imported in the test files. Update the mock setup to:
  ```js
  import { mockI18n } from '../../__mocks__/i18n';
  ```

## Component Test Failures

### SignupStatusDisplay Component
- **File**: `src/modules/components/SignupStatusDisplay.test.tsx`
- **Error**: Unable to find element by data-testid="receipt-upload"
- **Fix**: Update the mock component to use the correct test ID or update the test to match the actual component's test ID.

### UserHome Component
- **File**: `src/modules/user/index.test.jsx`
- **Errors**: 
  - Button attributes not found
  - Typography attributes not found
- **Fix**: Update the component to properly apply Material-UI props or update the tests to match the actual component implementation.

### Inscripcion Component
- **File**: `src/modules/inscripcion/index.test.tsx`
- **Errors**:
  - Missing text elements
  - Missing test IDs
- **Fix**: 
  - Ensure all required components are rendered
  - Add missing test IDs to components
  - Update text content to match i18n translations

### Event Management Integration
- **File**: `src/modules/eventManagement/event.integration.test.jsx`
- **Errors**:
  - CRUD operations not being called
  - Missing UI elements
  - Network error handling not working
- **Fix**:
  - Properly mock event management functions
  - Add missing UI elements and text
  - Implement proper error handling and display

### Admin Operations
- **File**: `src/modules/admin/admin.integration.test.tsx`
- **Errors**:
  - Function calls not being made
  - Promise rejection handling
- **Fix**:
  - Properly mock admin functions
  - Implement proper error handling
  - Update test assertions to match actual behavior

## Authentication and Authorization

### WithAuthentication Component
- **File**: `src/modules/withAuthentication.test.tsx`
- **Error**: Cannot read properties of undefined (reading 'uid')
- **Fix**: Ensure mock user data is properly structured with all required fields.

### Protected Routes
- **File**: `src/modules/ProtectedRoute.test.jsx`
- **Error**: Route protection not working as expected
- **Fix**: Update route protection logic and ensure proper mock setup for authentication state.

## App Component

### Main App Tests
- **File**: `src/App.test.js`
- **Error**: getFutureEti is not a function
- **Fix**: 
  - Properly export and mock the getFutureEti function
  - Update the import statement in App.js
  - Ensure the mock returns the expected data structure

## Next Steps

1. Fix mock exports and imports
2. Update component test IDs and assertions
3. Implement proper error handling in components
4. Update authentication and authorization logic
5. Fix event management integration tests
6. Update i18n mock implementation 