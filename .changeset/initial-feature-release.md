---
"stins": minor
---

Add type-safe validation and middleware utilities for Standard Schema

## Features

### Validation
- `validate(schema, data)` - Async schema validation
- `validateSync(schema, data)` - Synchronous validation
- `formatIssues(issues)` - Format validation errors for display

### HTTP Status Constants
- `stins/http-status-codes` - Numeric constants (OK, CREATED, NOT_FOUND, etc.)
- `stins/http-status-phrases` - String phrases for status codes
- Also available via `HTTP_STATUS_CODES` and `HTTP_STATUS_PHRASES` objects

### Framework Middleware
Ready-to-use adapters with consistent error handling:
- **Hono** - `validationHookSync`, `onError`, `notFound`
- **Express** - `validateBody`, `onError`, `notFound`
- **H3** - `validateBody`, `onError`, `notFound`
- **Elysia** - `validate`, `onError`, `notFound`
- **TanStack Start** - `validateInput`

### OpenAPI Helpers
- `jsonContent(schema, description)` - Response content definition
- `jsonContentRequired(schema, description)` - Required response content
- `oneOf(schemas)` - Union type helper

### Core Utilities
- `validateRequest(schema, data)` - Framework-agnostic validation
- `createErrorResponse(error)` - Standardized error responses
- `createNotFoundResponse(path)` - Not found responses
