# Testing Guide

This project uses Jest and React Testing Library for unit testing UI components.

## Setup

The following testing dependencies are installed:

- jest
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event
- ts-jest
- jest-environment-jsdom

## Running Tests

```bash
npm test
```

```bash
npm run test:watch
```

```bash
npm run test:coverage
```

## Test Structure

Tests are located in `__tests__` directories next to the components they test:

```
src/
  components/
    __tests__/
      Navbar.test.tsx
      ThemeToggle.test.tsx
      LanguageToggle.test.tsx
    movies/
      __tests__/
        MovieCard.test.tsx
        SearchBar.test.tsx
    ui/
      __tests__/
        button.test.tsx
        input.test.tsx
```

## Test Coverage

Current test coverage includes:

- Button component (7 tests)
- Input component (5 tests)
- SearchBar component (5 tests)
- MovieCard component (5 tests)
- Navbar component (2 tests)
- ThemeToggle component (2 tests)
- LanguageToggle component (3 tests)

Total: 29 passing tests across 7 test suites

## Configuration Files

- `jest.config.cjs` - Jest configuration
- `tsconfig.jest.json` - TypeScript configuration for Jest
- `src/setupTests.ts` - Test environment setup
