# Bidding Platform API

## Table of Contents

- [Documentation](#documentation)
- [Deployed API](#deployed-api)
- [Completion as per provided docs](#completion-as-per-provided-docs)
- [Steps to Run Locally](#steps-to-run-locally)
- [Steps for local building](#steps-for-local-building)
- [Steps to run via docker](#steps-to-run-via-docker)
  
## Documentation
[Postman Documentation](https://documenter.getpostman.com/view/28036992/2sA3QwapCo)

## Completion as per provided docs
1. All routes/endpoints completed
2. Real time notification system complete
3. JWT, RBAC, Rate limiter, XSS, ValidateZOD Middleware
4. Validation and Error Handling Complete
5. Image Upload (Multer), Search and Filter, Pagination Complete
6. Project Structure Organized
7. Eslint Linter, Logging via Winston, Prettier
8. Reset Password and Otp Via Nodemailer
9. Docker for Containerization
10. Documentation on Postman, Deployment on EC2

## Steps to Run Locally

1. Clone the repository
    ```bash
    git clone https://github.com/Lakshyaraj21/bidding-api.git
    cd bidding-api
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Fill in the environment variables in a `.env` file
    ```env
    DATABASE_URL="POSTGRESQL_DATABASE_URL"
    JWT_SECRET="your_jwt_secret"
    PORT=3000
    MAILER_EMAIL_ID="YOUR_EMAIL_ID"
    MAILER_PASSWORD="YOUR_EMAIL_APP_PASSWORD"
    ```

4. Generate Prisma client
    ```bash
    npx prisma generate
    ```

5. Start the development server
    ```bash
    npm run dev
    ```


## Steps for local building 
```bash
npm run build
npm run start
````

## Steps to run via docker 
```bash
docker build --build-arg PORT=3000 --build-arg DATABASE_URL="postgresql://postgres:password@localhost:5432/db?schema=public" --build-arg JWT_SECRET="your_jwt_secret" --build-arg MAILER_EMAIL_ID="YOUR_EMAIL_ID" --build-arg MAILER_PASSWORD="YOUR_EMAIL_APP_PASSWORD" -t server .
```
```bash
docker run -p 3000:3000 server
```

## Linting
Run the following command to lint your code:
```bash
npm run lint
```

## Formatting
Run the following command to format your code:
```bash
npm run format
```
