# FXQL Statement Parser

A NestJS application for parsing Foreign Exchange Query Language (FXQL) statements.

## Features

- FXQL statement parsing and validation
- PostgreSQL database integration
- Swagger API documentation
- Docker support
- Unit tests
- Input validation
- Error handling with detailed messages

## Prerequisites

- Node.js 18+
- PostgreSQL
- Docker (optional)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=fxql
NODE_ENV=development
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker-compose up
```

## API Documentation

Once the application is running, visit `/` for the Swagger documentation.

### API Endpoint

POST `/fxql-statements`

Request body:

```json
{
  "FXQL": "USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}"
}
```

## Testing

```bash
npm run test
```

## Design Decisions

1. **Database Schema**: Used a single table for currency pairs with unique constraints on source and destination currencies to ensure only the latest rates are stored.

2. **Error Handling**: Implemented detailed error messages with specific validation failures.

3. **Rate Limiting**: Implemented a 1000 currency pair limit per request as specified.

4. **Input Validation**: Used class-validator for DTO validation and custom regex patterns for FXQL syntax validation.

5. **TypeORM**: Chosen for its excellent TypeScript support and ease of use with PostgreSQL.

## Assumptions

1. Currency pairs are unique in the database, with newer entries updating existing ones.
2. All numeric values are positive.
3. CAP values must be whole numbers.
4. Currency codes are exactly 3 uppercase letters.
