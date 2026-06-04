FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma Client classes
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
