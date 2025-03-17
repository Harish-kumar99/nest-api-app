# NestJS Authentication API

A robust authentication API built with NestJS, featuring JWT authentication, user management, and database integration.

## Features

- JWT-based authentication
- User registration and login
- Password hashing with crypto
- MySQL database integration with TypeORM
- Rate limiting for API endpoints
- Input validation and transformation
- Environment-based configuration

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd nest-auth-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy the example environment file:
   ```bash
   cp example.env .env
   ```
   - Update the `.env` file with your database credentials and secret key:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database_name
   SECRET_KEY=your-secret-key
   ```

4. Run database migrations:
```bash
npm run migration:run
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```
The application will start in development mode with hot-reload enabled.

### Production Mode
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user and get JWT token

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Database Migrations

To generate a new migration:
```bash
npm run migration:generate -- src/migrations/migration-name
```

To run migrations:
```bash
npm run migration:run
```

## Scripts

- `npm run build` - Build the application
- `npm run start:dev` - Start in development mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # Users module
├── common/         # Common utilities and decorators
├── config/         # Configuration files
├── datasource.ts   # Database configuration
└── main.ts         # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the UNLICENSED License.
