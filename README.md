# stins

Type-safe validation and middleware utilities built on [Standard Schema](https://github.com/standard-schema/standard-schema).

## Features

- **Schema-agnostic** - Works with any Standard Schema validator (Zod, Valibot, ArkType, etc.)
- **Framework adapters** - Ready-to-use middleware for Hono, Express, H3, Elysia, TanStack Start
- **Type-safe** - Full TypeScript inference from your schemas
- **Consistent errors** - Unified error response format across all frameworks
- **OpenAPI helpers** - Utilities for building OpenAPI specs

## Installation

```bash
bun add stins
# or
pnpm add stins
# or
npm install stins
```

## Quick Start

```ts
import { z } from "zod";
import { validate } from "stins";

const userSchema = z.object({
name: z.string(),
email: z.string().email(),
});

const result = await validate(userSchema, data);

if (result.success) {
console.log(result.data); // typed as { name: string; email: string }
} else {
console.log(result.issues); // validation errors
}
```

## Framework Adapters

### Hono

```ts
import { Hono } from "hono";
import { validator } from "hono/validator";
import { notFound, onError, validationHookSync } from "stins/middleware/hono";

const app = new Hono();

// Error handling
app.onError(onError());
app.notFound(notFound());

// Request validation
app.post(
"/users",
validator("json", validationHookSync(userSchema)),
(c) => {
  const user = c.req.valid("json"); // typed
  return c.json({ user });
}
);
```

### Express

```ts
import express from "express";
import { notFound, onError, validateBody } from "stins/middleware/express";

const app = express();
app.use(express.json());

app.post("/users", validateBody(userSchema), (req, res) => {
res.json({ user: req.body }); // req.body is typed
});

// Error handling (add after routes)
app.use(notFound());
app.use(onError());
```

### H3

```ts
import { createApp, createRouter, eventHandler } from "h3";
import { notFound, onError, validateBody } from "stins/middleware/h3";

const app = createApp({ onError: onError() });
const router = createRouter();

router.post(
"/users",
eventHandler(async (event) => {
  const body = await validateBody(event, userSchema);
  return { user: body };
})
);

app.use(router);
app.use(notFound());
```

### Elysia

```ts
import { Elysia } from "elysia";
import { notFound, onError, validate } from "stins/middleware/elysia";

const app = new Elysia()
.onError(onError())
.post("/users", async ({ body }) => {
  const user = await validate(userSchema, body);
  return { user };
})
.onError(notFound());
```

### TanStack Start

```ts
import { createServerFn } from "@tanstack/start";
import { validateInput } from "stins/middleware/tanstack-start";

const createUser = createServerFn({ method: "POST" })
.validator(validateInput(userSchema))
.handler(async ({ data }) => {
  // data is typed
  return { user: data };
});
```

## Core APIs

### Validation

```ts
import { validate, validateSync, formatIssues } from "stins";

// Async validation
const result = await validate(schema, data);

// Sync validation (throws if schema is async)
const result = validateSync(schema, data);

// Format issues for display
if (!result.success) {
const formatted = formatIssues(result.issues);
// [{ path: "email", message: "Invalid email" }]
}
```

### Middleware Core

```ts
import { validateRequest, createErrorResponse, createNotFoundResponse } from "stins";

// Framework-agnostic request validation
const result = await validateRequest(schema, data);
if (!result.success) {
return new Response(JSON.stringify(result.body), { status: result.status });
}

// Standardized error responses
const errorResponse = createErrorResponse(new Error("Something failed"));
const notFoundResponse = createNotFoundResponse("/api/users/123");
```

## HTTP Status Constants

Type-safe HTTP status codes and phrases to avoid magic numbers:

```ts
import { OK, CREATED, NOT_FOUND, BAD_REQUEST } from "stins/http-status-codes";
import * as HTTP_PHRASES from "stins/http-status-phrases";

// Success response
return c.json({ user }, OK);

// Error response with phrase
return c.json({
status: NOT_FOUND,
error: HTTP_PHRASES.NOT_FOUND,
message: `User ${id} not found`,
}, NOT_FOUND);

// Custom error class
class ApiError extends Error {
constructor(
  public status: number,
  public code: string,
  message: string
) {
  super(message);
}
}

throw new ApiError(BAD_REQUEST, "INVALID_EMAIL", "Email format is invalid");
```

Also available as objects from the main export:

```ts
import { HTTP_STATUS_CODES, HTTP_STATUS_PHRASES } from "stins";

HTTP_STATUS_CODES.OK; // 200
HTTP_STATUS_PHRASES.OK; // "OK"
```

## OpenAPI Helpers

Utilities for building OpenAPI-compatible response definitions:

```ts
import { jsonContent, jsonContentRequired, oneOf } from "stins/openapi";

const responses = {
200: jsonContent(userSchema["~standard"].toJSONSchema(), "Successful response"),
400: jsonContentRequired(errorSchema["~standard"].toJSONSchema(), "Validation error"),
};
```

## License

MIT
