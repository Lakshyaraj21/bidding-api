FROM node:18.17.1

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm rebuild bcrypt --build-from-source

COPY . .

ARG PORT=3001

ARG DATABASE_URL="postgresql://postgres:password@localhost:5432/db?schema=public"

ARG JWT_SECRET="your_jwt_secret_key"

ARG MAILER_EMAIL_ID="your_email_id"

ARG MAILER_PASSWORD="your_email_password"

ENV PORT=$PORT

ENV DATABSE_URL=$DATABASE_URL

ENV JWT_SECRET=$JWT_SECRET

ENV MAILER_EMAIL_ID=$MAILER_EMAIL_ID

ENV MAILER_PASSWORD=$MAILER_PASSWORD

EXPOSE $PORT

RUN npx prisma generate

RUN npm run test

RUN npm run build

CMD ["npm", "run", "start"]