# stins

## 0.1.0

### Minor Changes

- [#2](https://github.com/johnie/stins/pull/2) [`f68fe82`](https://github.com/johnie/stins/commit/f68fe820638822ed2ac296d8f6ad2be1641a4822) Thanks [@johnie](https://github.com/johnie)! - Add type-safe validation and middleware utilities for Standard Schema

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

## 0.0.2

### Patch Changes

- [`426fe7d`](https://github.com/johnie/stins/commit/426fe7d71de927c074a170232d4c1fc69ec7aeeb) Thanks [@johnie](https://github.com/johnie)! - Initial version of the package
