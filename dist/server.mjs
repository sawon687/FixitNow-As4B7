
   import { createRequire } from 'module';
   const require = createRequire(import.meta.url);
  

// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/config/config.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  appurl: process.env.APP_URL,
  bycriptHashRound: process.env.BCRYPT_SALT_ROUNDS,
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  jwt_access_Expires: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_Expires: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_secret_Key: process.env.STRIPE_SECRET_KEY
};
var config_default = config;

// src/module/auth/auth.route.ts
import { Router } from "express";

// src/utils/catchAsync.ts
import status from "http-status";
var baseController = class {
  handle(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res);
      } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
          success: false,
          status: status.INTERNAL_SERVER_ERROR,
          message: "Internal server error",
          errormessage: error instanceof Error ? error.message : error
        });
      }
    };
  }
};

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.status).json({
    success: data.success,
    status: data.status,
    message: data.message,
    data: data.data
  });
};

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model TechnicianProfile {\n  id                String   @id @default(uuid()) @db.Uuid\n  userId            String   @unique @db.Uuid\n  bio               String?\n  yearsOfExperience Int\n  skills            String[]\n  location          String\n  avgRating         Float    @default(0)\n  users             Users    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  services       Service[]\n  bookings       Booking[]\n  reviews        Review[]\n  availabilities Availability[]\n  createdAt      DateTime       @default(now())\n  updatedAt      DateTime       @updatedAt\n}\n\nmodel Availability {\n  id           String @id @default(uuid()) @db.Uuid\n  technicianId String @db.Uuid\n\n  date      String\n  startTime String\n  endTime   String\n\n  status AvailabilityStatus @default(Available) // "available", "booked", \u0985\u09A5\u09AC\u09BE "blocked"\n\n  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Booking {\n  id String @id @default(uuid()) @db.Uuid\n\n  userId       String @db.Uuid\n  technicianId String @db.Uuid\n  serviceId    String @db.Uuid\n\n  scheduledDate String\n  address       String\n  status        BookingStatus @default(REQUESTED)\n  startTime     String\n  totalAmount   Float\n\n  cancelledAt DateTime?\n  completedAt DateTime?\n\n  customer   Users             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n  service    Service           @relation(fields: [serviceId], references: [id], onDelete: Cascade)\n\n  review Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  payment   Payment?\n}\n\nenum CategoryStatus {\n  ACTIVE\n  INACTIVE\n}\n\nmodel Category {\n  id          String         @id @default(uuid()) @db.Uuid\n  name        String\n  description String?\n  status      CategoryStatus @default(ACTIVE)\n\n  services Service[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum BookingStatus {\n  REQUESTED\n  ACCEPTED\n  DECLINED\n  COMPLETED\n  CANCELLED\n  IN_PROGRESS\n}\n\nenum Role {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum UserStatus {\n  UNBAN\n  BAN\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  CANCELLED\n}\n\nenum AvailabilityStatus {\n  Available\n  Booked\n  Blocked\n}\n\nmodel Payment {\n  id            String        @id @default(uuid()) @db.Uuid\n  transactionId String        @unique\n  bookingId     String        @unique @db.Uuid\n  customerId    String        @db.Uuid\n  amount        Float\n  status        PaymentStatus @default(PENDING)\n  method        String        @default("Stripe")\n  paidAt        DateTime?\n  createdAt     DateTime      @default(now())\n  booking       Booking       @relation(fields: [bookingId], references: [id])\n  customer      Users         @relation(fields: [customerId], references: [id], onDelete: Cascade)\n}\n\nmodel Review {\n  id String @id @default(uuid()) @db.Uuid\n\n  bookingId    String  @db.Uuid\n  userId       String  @db.Uuid\n  technicianId String  @db.Uuid\n  rating       Float\n  comment      String?\n\n  booking    Booking           @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  customer   Users             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Service {\n  id String @id @default(uuid()) @db.Uuid\n\n  technicianId String @db.Uuid\n  categoryId   String @db.Uuid\n  userId       String @db.Uuid\n\n  title       String\n  description String\n  price       Float\n  priceType   String\n  isActive    Boolean @default(true)\n\n  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n  category   Category          @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  bookings Booking[]\n\n  createdAt DateTime @default(now())\n}\n\nmodel Users {\n  id                String             @id @default(uuid()) @db.Uuid\n  name              String             @db.VarChar(100)\n  email             String             @unique @db.VarChar(100)\n  password          String\n  role              Role\n  profilePhoto      String\n  status            UserStatus         @default(UNBAN)\n  bookings          Booking[]\n  reviews           Review[]\n  createdAt         DateTime           @default(now())\n  updatedAt         DateTime           @updatedAt\n  technicianProfile TechnicianProfile?\n  payment           Payment[]\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"yearsOfExperience","kind":"scalar","type":"Int"},{"name":"skills","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"users","kind":"object","type":"Users","relationName":"TechnicianProfileToUsers"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToTechnicianProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTechnicianProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTechnicianProfile"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTechnicianProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AvailabilityStatus"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"AvailabilityToTechnicianProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"scheduledDate","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"Users","relationName":"BookingToUsers"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"BookingToTechnicianProfile"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CategoryStatus"},{"name":"services","kind":"object","type":"Service","relationName":"CategoryToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"method","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"customer","kind":"object","type":"Users","relationName":"PaymentToUsers"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"comment","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"customer","kind":"object","type":"Users","relationName":"ReviewToUsers"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ReviewToTechnicianProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"priceType","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ServiceToTechnicianProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToService"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Users":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUsers"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUsers"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToUsers"}],"dbName":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","customer","technician","services","_count","category","bookings","service","booking","review","payment","reviews","technicianProfile","users","availabilities","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","data","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","create","update","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","having","_avg","_sum","_min","_max","TechnicianProfile.groupBy","TechnicianProfile.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","Users.findUnique","Users.findUniqueOrThrow","Users.findFirst","Users.findFirstOrThrow","Users.findMany","Users.createOne","Users.createMany","Users.createManyAndReturn","Users.updateOne","Users.updateMany","Users.updateManyAndReturn","Users.upsertOne","Users.deleteOne","Users.deleteMany","Users.groupBy","Users.aggregate","AND","OR","NOT","id","name","email","password","Role","role","profilePhoto","UserStatus","status","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","technicianId","categoryId","userId","title","description","price","priceType","isActive","bookingId","rating","comment","transactionId","customerId","amount","PaymentStatus","method","paidAt","CategoryStatus","serviceId","scheduledDate","address","BookingStatus","startTime","totalAmount","cancelledAt","completedAt","date","endTime","AvailabilityStatus","bio","yearsOfExperience","skills","location","avgRating","has","hasEvery","hasSome","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "2gRQgAERBQAAlAIAIAgAAPUBACANAAD2AQAgDwAAqQIAIBAAAKwCACCZAQAAqgIAMJoBAAAWABCbAQAAqgIAMJwBAQAAAAGlAUAA9AEAIaYBQAD0AQAhtwEBAAAAAdIBAQCSAgAh0wECAKsCACHUAQAAnwIAINUBAQDxAQAh1gEIAKUCACEBAAAAAQAgFQMAAKkCACAEAACjAgAgCQAAswIAIAsAAPYBACAMAAC0AgAgmQEAALECADCaAQAAAwAQmwEAALECADCcAQEA8AEAIaQBAACyAssBIqUBQAD0AQAhpgFAAPQBACG1AQEA8AEAIbcBAQDwAQAhxwEBAPABACHIAQEA8QEAIckBAQDxAQAhywEBAPEBACHMAQgApQIAIc0BQACnAgAhzgFAAKcCACEHAwAAjwQAIAQAANoDACAJAACTBAAgCwAA2QMAIAwAAJQEACDNAQAA4wMAIM4BAADjAwAgFQMAAKkCACAEAACjAgAgCQAAswIAIAsAAPYBACAMAAC0AgAgmQEAALECADCaAQAAAwAQmwEAALECADCcAQEAAAABpAEAALICywEipQFAAPQBACGmAUAA9AEAIbUBAQDwAQAhtwEBAPABACHHAQEA8AEAIcgBAQDxAQAhyQEBAPEBACHLAQEA8QEAIcwBCAClAgAhzQFAAKcCACHOAUAApwIAIQMAAAADACABAAAEADACAAAFACAQBAAAowIAIAcAALACACAIAAD1AQAgmQEAAK4CADCaAQAABwAQmwEAAK4CADCcAQEA8AEAIaUBQAD0AQAhtQEBAPABACG2AQEA8AEAIbcBAQDwAQAhuAEBAPEBACG5AQEA8QEAIboBCAClAgAhuwEBAPEBACG8ASAArwIAIQMEAADaAwAgBwAAkgQAIAgAANgDACAQBAAAowIAIAcAALACACAIAAD1AQAgmQEAAK4CADCaAQAABwAQmwEAAK4CADCcAQEAAAABpQFAAPQBACG1AQEA8AEAIbYBAQDwAQAhtwEBAPABACG4AQEA8QEAIbkBAQDxAQAhugEIAKUCACG7AQEA8QEAIbwBIACvAgAhAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAAHACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAMAIA0DAACpAgAgBAAAowIAIAoAAKgCACCZAQAArQIAMJoBAAAOABCbAQAArQIAMJwBAQDwAQAhpQFAAPQBACG1AQEA8AEAIbcBAQDwAQAhvQEBAPABACG-AQgApQIAIb8BAQCSAgAhBAMAAI8EACAEAADaAwAgCgAAkQQAIL8BAADjAwAgDQMAAKkCACAEAACjAgAgCgAAqAIAIJkBAACtAgAwmgEAAA4AEJsBAACtAgAwnAEBAAAAAaUBQAD0AQAhtQEBAPABACG3AQEA8AEAIb0BAQDwAQAhvgEIAKUCACG_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_gMAICMAAP8DACAkAACCBAAgJQAAgQQAICYAAIAEACDNAQAA4wMAIM4BAADjAwAgEJkBAACVAgAwmgEAAGgAEJsBAACVAgAwnAEBAOABACGkAQAAlgLLASKlAUAA5AEAIaYBQADkAQAhtQEBAOABACG3AQEA4AEAIccBAQDgAQAhyAEBAOEBACHJAQEA4QEAIcsBAQDhAQAhzAEIAPsBACHNAUAAiAIAIc4BQACIAgAhAwAAAAMAIAEAAGcAMCIAAGgAIAMAAAADACABAAAEADACAAAFACAKBQAAlAIAIJkBAACRAgAwmgEAAG4AEJsBAACRAgAwnAEBAAAAAZ0BAQDxAQAhpAEAAJMCxwEipQFAAPQBACGmAUAA9AEAIbkBAQCSAgAhAQAAAGsAIAEAAABrACAKBQAAlAIAIJkBAACRAgAwmgEAAG4AEJsBAACRAgAwnAEBAPABACGdAQEA8QEAIaQBAACTAscBIqUBQAD0AQAhpgFAAPQBACG5AQEAkgIAIQIFAAD9AwAguQEAAOMDACADAAAAbgAgAQAAbwAwAgAAawAgAwAAAG4AIAEAAG8AMAIAAGsAIAMAAABuACABAABvADACAABrACAHBQAA_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_AQAA4wMAIAqZAQAAgQIAMJoBAACtAQAQmwEAAIECADCcAQEA4AEAIaUBQADkAQAhtQEBAOABACG3AQEA4AEAIb0BAQDgAQAhvgEIAPsBACG_AQEAggIAIQMAAAAOACABAACsAQAwIgAArQEAIAMAAAAOACABAAAPADACAAAQACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA0EAADiAwAgBwAAuwMAIAgAALwDACCcAQEAAAABpQFAAAAAAbUBAQAAAAG2AQEAAAABtwEBAAAAAbgBAQAAAAG5AQEAAAABugEIAAAAAbsBAQAAAAG8ASAAAAABARYAALUBACAKnAEBAAAAAaUBQAAAAAG1AQEAAAABtgEBAAAAAbcBAQAAAAG4AQEAAAABuQEBAAAAAboBCAAAAAG7AQEAAAABvAEgAAAAAQEWAAC3AQAwARYAALcBADANBAAA4QMAIAcAAK0DACAIAACuAwAgnAEBALgCACGlAUAAuwIAIbUBAQC4AgAhtgEBALgCACG3AQEAuAIAIbgBAQC4AgAhuQEBALgCACG6AQgAygIAIbsBAQC4AgAhvAEgAKsDACECAAAACQAgFgAAugEAIAqcAQEAuAIAIaUBQAC7AgAhtQEBALgCACG2AQEAuAIAIbcBAQC4AgAhuAEBALgCACG5AQEAuAIAIboBCADKAgAhuwEBALgCACG8ASAAqwMAIQIAAAAHACAWAAC8AQAgAgAAAAcAIBYAALwBACADAAAACQAgHQAAtQEAIB4AALoBACABAAAACQAgAQAAAAcAIAUGAADcAwAgIwAA3QMAICQAAOADACAlAADfAwAgJgAA3gMAIA2ZAQAA-gEAMJoBAADDAQAQmwEAAPoBADCcAQEA4AEAIaUBQADkAQAhtQEBAOABACG2AQEA4AEAIbcBAQDgAQAhuAEBAOEBACG5AQEA4QEAIboBCAD7AQAhuwEBAOEBACG8ASAA_AEAIQMAAAAHACABAADCAQAwIgAAwwEAIAMAAAAHACABAAAIADACAAAJACAQCAAA9QEAIAwAAPgBACANAAD2AQAgDgAA9wEAIJkBAADvAQAwmgEAAMkBABCbAQAA7wEAMJwBAQAAAAGdAQEA8QEAIZ4BAQAAAAGfAQEA8QEAIaEBAADyAaEBIqIBAQDxAQAhpAEAAPMBpAEipQFAAPQBACGmAUAA9AEAIQEAAADGAQAgAQAAAMYBACAQCAAA9QEAIAwAAPgBACANAAD2AQAgDgAA9wEAIJkBAADvAQAwmgEAAMkBABCbAQAA7wEAMJwBAQDwAQAhnQEBAPEBACGeAQEA8QEAIZ8BAQDxAQAhoQEAAPIBoQEiogEBAPEBACGkAQAA8wGkASKlAUAA9AEAIaYBQAD0AQAhBAgAANgDACAMAADbAwAgDQAA2QMAIA4AANoDACADAAAAyQEAIAEAAMoBADACAADGAQAgAwAAAMkBACABAADKAQAwAgAAxgEAIAMAAADJAQAgAQAAygEAMAIAAMYBACANCAAA1AMAIAwAANcDACANAADVAwAgDgAA1gMAIJwBAQAAAAGdAQEAAAABngEBAAAAAZ8BAQAAAAGhAQAAAKEBAqIBAQAAAAGkAQAAAKQBAqUBQAAAAAGmAUAAAAABARYAAM4BACAJnAEBAAAAAZ0BAQAAAAGeAQEAAAABnwEBAAAAAaEBAAAAoQECogEBAAAAAaQBAAAApAECpQFAAAAAAaYBQAAAAAEBFgAA0AEAMAEWAADQAQAwDQgAALwCACAMAAC_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-AQAgpwEgAAAAAa4BIAD9AQAhBQYAAOYBACAlAAD-AQAgJgAA_gEAIKcBIAAAAAGuASAA_QEAIQKnASAAAAABrgEgAP4BACENBgAA5gEAICMAAIACACAkAACAAgAgJQAAgAIAICYAAIACACCnAQgAAAABqAEIAAAABKkBCAAAAASqAQgAAAABqwEIAAAAAawBCAAAAAGtAQgAAAABrgEIAP8BACEIpwEIAAAAAagBCAAAAASpAQgAAAAEqgEIAAAAAasBCAAAAAGsAQgAAAABrQEIAAAAAa4BCACAAgAhCpkBAACBAgAwmgEAAK0BABCbAQAAgQIAMJwBAQDgAQAhpQFAAOQBACG1AQEA4AEAIbcBAQDgAQAhvQEBAOABACG-AQgA-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_AQEAkgIAIRAEAACjAgAgBwAAsAIAIAgAAPUBACCZAQAArgIAMJoBAAAHABCbAQAArgIAMJwBAQDwAQAhpQFAAPQBACG1AQEA8AEAIbYBAQDwAQAhtwEBAPABACG4AQEA8QEAIbkBAQDxAQAhugEIAKUCACG7AQEA8QEAIbwBIACvAgAhAqcBIAAAAAGuASAA_gEAIQwFAACUAgAgmQEAAJECADCaAQAAbgAQmwEAAJECADCcAQEA8AEAIZ0BAQDxAQAhpAEAAJMCxwEipQFAAPQBACGmAUAA9AEAIbkBAQCSAgAh2gEAAG4AINsBAABuACAVAwAAqQIAIAQAAKMCACAJAACzAgAgCwAA9gEAIAwAALQCACCZAQAAsQIAMJoBAAADABCbAQAAsQIAMJwBAQDwAQAhpAEAALICywEipQFAAPQBACGmAUAA9AEAIbUBAQDwAQAhtwEBAPABACHHAQEA8AEAIcgBAQDxAQAhyQEBAPEBACHLAQEA8QEAIcwBCAClAgAhzQFAAKcCACHOAUAApwIAIQSnAQAAAMsBAqgBAAAAywEIqQEAAADLAQiuAQAAmALLASISBAAAowIAIAcAALACACAIAAD1AQAgmQEAAK4CADCaAQAABwAQmwEAAK4CADCcAQEA8AEAIaUBQAD0AQAhtQEBAPABACG2AQEA8AEAIbcBAQDwAQAhuAEBAPEBACG5AQEA8QEAIboBCAClAgAhuwEBAPEBACG8ASAArwIAIdoBAAAHACDbAQAABwAgEAMAAKkCACAKAACoAgAgmQEAAKQCADCaAQAAEgAQmwEAAKQCADCcAQEA8AEAIaQBAACmAsQBIqUBQAD0AQAhvQEBAPABACHAAQEA8QEAIcEBAQDwAQAhwgEIAKUCACHEAQEA8QEAIcUBQACnAgAh2gEAABIAINsBAAASACAAAAAB3wEBAAAAAQHfAQAAAKEBAgHfAQAAAKQBAgHfAUAAAAABCx0AAMsDADAeAADPAwAw3AEAAMwDADDdAQAAzQMAMN4BAADOAwAg3wEAAP4CADDgAQAA_gIAMOEBAAD-AgAw4gEAAP4CADDjAQAA0AMAMOQBAACBAwAwCx0AAMIDADAeAADGAwAw3AEAAMMDADDdAQAAxAMAMN4BAADFAwAg3wEAAO4CADDgAQAA7gIAMOEBAADuAgAw4gEAAO4CADDjAQAAxwMAMOQBAADxAgAwBx0AANECACAeAADUAgAg3AEAANICACDdAQAA0wIAIOABAAAWACDhAQAAFgAg4gEAAAEAIAsdAADAAgAwHgAAxQIAMNwBAADBAgAw3QEAAMICADDeAQAAwwIAIN8BAADEAgAw4AEAAMQCADDhAQAAxAIAMOIBAADEAgAw4wEAAMYCADDkAQAAxwIAMAkKAADQAgAgnAEBAAAAAaQBAAAAxAECpQFAAAAAAb0BAQAAAAHAAQEAAAABwgEIAAAAAcQBAQAAAAHFAUAAAAABAgAAABkAIB0AAM8CACADAAAAGQAgHQAAzwIAIB4AAM0CACABFgAA2gQAMA4DAACpAgAgCgAAqAIAIJkBAACkAgAwmgEAABIAEJsBAACkAgAwnAEBAAAAAaQBAACmAsQBIqUBQAD0AQAhvQEBAAAAAcABAQAAAAHBAQEA8AEAIcIBCAClAgAhxAEBAPEBACHFAUAApwIAIQIAAAAZACAWAADNAgAgAgAAAMgCACAWAADJAgAgDJkBAADHAgAwmgEAAMgCABCbAQAAxwIAMJwBAQDwAQAhpAEAAKYCxAEipQFAAPQBACG9AQEA8AEAIcABAQDxAQAhwQEBAPABACHCAQgApQIAIcQBAQDxAQAhxQFAAKcCACEMmQEAAMcCADCaAQAAyAIAEJsBAADHAgAwnAEBAPABACGkAQAApgLEASKlAUAA9AEAIb0BAQDwAQAhwAEBAPEBACHBAQEA8AEAIcIBCAClAgAhxAEBAPEBACHFAUAApwIAIQicAQEAuAIAIaQBAADLAsQBIqUBQAC7AgAhvQEBALgCACHAAQEAuAIAIcIBCADKAgAhxAEBALgCACHFAUAAzAIAIQXfAQgAAAAB5gEIAAAAAecBCAAAAAHoAQgAAAAB6QEIAAAAAQHfAQAAAMQBAgHfAUAAAAABCQoAAM4CACCcAQEAuAIAIaQBAADLAsQBIqUBQAC7AgAhvQEBALgCACHAAQEAuAIAIcIBCADKAgAhxAEBALgCACHFAUAAzAIAIQUdAADVBAAgHgAA2AQAINwBAADWBAAg3QEAANcEACDiAQAABQAgCQoAANACACCcAQEAAAABpAEAAADEAQKlAUAAAAABvQEBAAAAAcABAQAAAAHCAQgAAAABxAEBAAAAAcUBQAAAAAEDHQAA1QQAINwBAADWBAAg4gEAAAUAIAwFAAC-AwAgCAAAvwMAIA0AAMADACAQAADBAwAgnAEBAAAAAaUBQAAAAAGmAUAAAAAB0gEBAAAAAdMBAgAAAAHUAQAAvQMAINUBAQAAAAHWAQgAAAABAgAAAAEAIB0AANECACADAAAAFgAgHQAA0QIAIB4AANUCACAOAAAAFgAgBQAA2QIAIAgAANoCACANAADbAgAgEAAA3AIAIBYAANUCACCcAQEAuAIAIaUBQAC7AgAhpgFAALsCACHSAQEA1gIAIdMBAgDXAgAh1AEAANgCACDVAQEAuAIAIdYBCADKAgAhDAUAANkCACAIAADaAgAgDQAA2wIAIBAAANwCACCcAQEAuAIAIaUBQAC7AgAhpgFAALsCACHSAQEA1gIAIdMBAgDXAgAh1AEAANgCACDVAQEAuAIAIdYBCADKAgAhAd8BAQAAAAEF3wECAAAAAeYBAgAAAAHnAQIAAAAB6AECAAAAAekBAgAAAAEC3wEBAAAABOUBAQAAAAULHQAAoQMAMB4AAKYDADDcAQAAogMAMN0BAACjAwAw3gEAAKQDACDfAQAApQMAMOABAAClAwAw4QEAAKUDADDiAQAApQMAMOMBAACnAwAw5AEAAKgDADALHQAA-gIAMB4AAP8CADDcAQAA-wIAMN0BAAD8AgAw3gEAAP0CACDfAQAA_gIAMOABAAD-AgAw4QEAAP4CADDiAQAA_gIAMOMBAACAAwAw5AEAAIEDADALHQAA6gIAMB4AAO8CADDcAQAA6wIAMN0BAADsAgAw3gEAAO0CACDfAQAA7gIAMOABAADuAgAw4QEAAO4CADDiAQAA7gIAMOMBAADwAgAw5AEAAPECADALHQAA3QIAMB4AAOICADDcAQAA3gIAMN0BAADfAgAw3gEAAOACACDfAQAA4QIAMOABAADhAgAw4QEAAOECADDiAQAA4QIAMOMBAADjAgAw5AEAAOQCADAHnAEBAAAAAaQBAAAA0gECpQFAAAAAAaYBQAAAAAHLAQEAAAABzwEBAAAAAdABAQAAAAECAAAAIwAgHQAA6QIAIAMAAAAjACAdAADpAgAgHgAA6AIAIAEWAADUBAAwDAQAAKMCACCZAQAAoQIAMJoBAAAhABCbAQAAoQIAMJwBAQAAAAGkAQAAogLSASKlAUAA9AEAIaYBQAD0AQAhtQEBAPABACHLAQEA8QEAIc8BAQDxAQAh0AEBAPEBACECAAAAIwAgFgAA6AIAIAIAAADlAgAgFgAA5gIAIAuZAQAA5AIAMJoBAADlAgAQmwEAAOQCADCcAQEA8AEAIaQBAACiAtIBIqUBQAD0AQAhpgFAAPQBACG1AQEA8AEAIcsBAQDxAQAhzwEBAPEBACHQAQEA8QEAIQuZAQAA5AIAMJoBAADlAgAQmwEAAOQCADCcAQEA8AEAIaQBAACiAtIBIqUBQAD0AQAhpgFAAPQBACG1AQEA8AEAIcsBAQDxAQAhzwEBAPEBACHQAQEA8QEAIQecAQEAuAIAIaQBAADnAtIBIqUBQAC7AgAhpgFAALsCACHLAQEAuAIAIc8BAQC4AgAh0AEBALgCACEB3wEAAADSAQIHnAEBALgCACGkAQAA5wLSASKlAUAAuwIAIaYBQAC7AgAhywEBALgCACHPAQEAuAIAIdABAQC4AgAhB5wBAQAAAAGkAQAAANIBAqUBQAAAAAGmAUAAAAABywEBAAAAAc8BAQAAAAHQAQEAAAABCAMAAPkCACAKAAD4AgAgnAEBAAAAAaUBQAAAAAG3AQEAAAABvQEBAAAAAb4BCAAAAAG_AQEAAAABAgAAABAAIB0AAPcCACADAAAAEAAgHQAA9wIAIB4AAPQCACABFgAA0wQAMA0DAACpAgAgBAAAowIAIAoAAKgCACCZAQAArQIAMJoBAAAOABCbAQAArQIAMJwBAQAAAAGlAUAA9AEAIbUBAQDwAQAhtwEBAPABACG9AQEA8AEAIb4BCAClAgAhvwEBAJICACECAAAAEAAgFgAA9AIAIAIAAADyAgAgFgAA8wIAIAqZAQAA8QIAMJoBAADyAgAQmwEAAPECADCcAQEA8AEAIaUBQAD0AQAhtQEBAPABACG3AQEA8AEAIb0BAQDwAQAhvgEIAKUCACG_AQEAkgIAIQqZAQAA8QIAMJoBAADyAgAQmwEAAPECADCcAQEA8AEAIaUBQAD0AQAhtQEBAPABACG3AQEA8AEAIb0BAQDwAQAhvgEIAKUCACG_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_AQEAAAABAgAAABAAIB0AAJoDACADAAAAEAAgHQAAmgMAIB4AAJgDACABFgAAvAQAMAIAAAAQACAWAACYAwAgAgAAAPICACAWAACXAwAgBpwBAQC4AgAhpQFAALsCACG1AQEAuAIAIbcBAQC4AgAhvgEIAMoCACG_AQEA1gIAIQgDAAD2AgAgBAAAmQMAIJwBAQC4AgAhpQFAALsCACG1AQEAuAIAIbcBAQC4AgAhvgEIAMoCACG_AQEA1gIAIQUdAAC3BAAgHgAAugQAINwBAAC4BAAg3QEAALkEACDiAQAAAQAgCAMAAPkCACAEAACbAwAgnAEBAAAAAaUBQAAAAAG1AQEAAAABtwEBAAAAAb4BCAAAAAG_AQEAAAABAx0AALcEACDcAQAAuAQAIOIBAAABACAQAwAAnQMAIAkAAJ4DACALAACfAwAgDAAAoAMAIJwBAQAAAAGkAQAAAMsBAqUBQAAAAAGmAUAAAAABtwEBAAAAAccBAQAAAAHIAQEAAAAByQEBAAAAAcsBAQAAAAHMAQgAAAABzQFAAAAAAc4BQAAAAAEDHQAAtQQAINwBAAC2BAAg4gEAAMYBACADHQAAswQAINwBAAC0BAAg4gEAAAkAIAQdAACRAwAw3AEAAJIDADDeAQAAlAMAIOIBAADuAgAwAx0AAIoDACDcAQAAiwMAIOIBAAAZACALBwAAuwMAIAgAALwDACCcAQEAAAABpQFAAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAbkBAQAAAAG6AQgAAAABuwEBAAAAAbwBIAAAAAECAAAACQAgHQAAugMAIAMAAAAJACAdAAC6AwAgHgAArAMAIAEWAACyBAAwEAQAAKMCACAHAACwAgAgCAAA9QEAIJkBAACuAgAwmgEAAAcAEJsBAACuAgAwnAEBAAAAAaUBQAD0AQAhtQEBAPABACG2AQEA8AEAIbcBAQDwAQAhuAEBAPEBACG5AQEA8QEAIboBCAClAgAhuwEBAPEBACG8ASAArwIAIQIAAAAJACAWAACsAwAgAgAAAKkDACAWAACqAwAgDZkBAACoAwAwmgEAAKkDABCbAQAAqAMAMJwBAQDwAQAhpQFAAPQBACG1AQEA8AEAIbYBAQDwAQAhtwEBAPABACG4AQEA8QEAIbkBAQDxAQAhugEIAKUCACG7AQEA8QEAIbwBIACvAgAhDZkBAACoAwAwmgEAAKkDABCbAQAAqAMAMJwBAQDwAQAhpQFAAPQBACG1AQEA8AEAIbYBAQDwAQAhtwEBAPABACG4AQEA8QEAIbkBAQDxAQAhugEIAKUCACG7AQEA8QEAIbwBIACvAgAhCZwBAQC4AgAhpQFAALsCACG2AQEAuAIAIbcBAQC4AgAhuAEBALgCACG5AQEAuAIAIboBCADKAgAhuwEBALgCACG8ASAAqwMAIQHfASAAAAABCwcAAK0DACAIAACuAwAgnAEBALgCACGlAUAAuwIAIbYBAQC4AgAhtwEBALgCACG4AQEAuAIAIbkBAQC4AgAhugEIAMoCACG7AQEAuAIAIbwBIACrAwAhBR0AAKcEACAeAACwBAAg3AEAAKgEACDdAQAArwQAIOIBAABrACALHQAArwMAMB4AALMDADDcAQAAsAMAMN0BAACxAwAw3gEAALIDACDfAQAA_gIAMOABAAD-AgAw4QEAAP4CADDiAQAA_gIAMOMBAAC0AwAw5AEAAIEDADAQAwAAnQMAIAQAALkDACALAACfAwAgDAAAoAMAIJwBAQAAAAGkAQAAAMsBAqUBQAAAAAGmAUAAAAABtQEBAAAAAbcBAQAAAAHIAQEAAAAByQEBAAAAAcsBAQAAAAHMAQgAAAABzQFAAAAAAc4BQAAAAAECAAAABQAgHQAAuAMAIAMAAAAFACAdAAC4AwAgHgAAtgMAIAEWAACuBAAwAgAAAAUAIBYAALYDACACAAAAggMAIBYAALUDACAMnAEBALgCACGkAQAAhAPLASKlAUAAuwIAIaYBQAC7AgAhtQEBALgCACG3AQEAuAIAIcgBAQC4AgAhyQEBALgCACHLAQEAuAIAIcwBCADKAgAhzQFAAMwCACHOAUAAzAIAIRADAACGAwAgBAAAtwMAIAsAAIgDACAMAACJAwAgnAEBALgCACGkAQAAhAPLASKlAUAAuwIAIaYBQAC7AgAhtQEBALgCACG3AQEAuAIAIcgBAQC4AgAhyQEBALgCACHLAQEAuAIAIcwBCADKAgAhzQFAAMwCACHOAUAAzAIAIQUdAACpBAAgHgAArAQAINwBAACqBAAg3QEAAKsEACDiAQAAAQAgEAMAAJ0DACAEAAC5AwAgCwAAnwMAIAwAAKADACCcAQEAAAABpAEAAADLAQKlAUAAAAABpgFAAAAAAbUBAQAAAAG3AQEAAAAByAEBAAAAAckBAQAAAAHLAQEAAAABzAEIAAAAAc0BQAAAAAHOAUAAAAABAx0AAKkEACDcAQAAqgQAIOIBAAABACALBwAAuwMAIAgAALwDACCcAQEAAAABpQFAAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAbkBAQAAAAG6AQgAAAABuwEBAAAAAbwBIAAAAAEDHQAApwQAINwBAACoBAAg4gEAAGsAIAQdAACvAwAw3AEAALADADDeAQAAsgMAIOIBAAD-AgAwAd8BAQAAAAQEHQAAoQMAMNwBAACiAwAw3gEAAKQDACDiAQAApQMAMAQdAAD6AgAw3AEAAPsCADDeAQAA_QIAIOIBAAD-AgAwBB0AAOoCADDcAQAA6wIAMN4BAADtAgAg4gEAAO4CADAEHQAA3QIAMNwBAADeAgAw3gEAAOACACDiAQAA4QIAMAgEAACbAwAgCgAA-AIAIJwBAQAAAAGlAUAAAAABtQEBAAAAAb0BAQAAAAG-AQgAAAABvwEBAAAAAQIAAAAQACAdAADKAwAgAwAAABAAIB0AAMoDACAeAADJAwAgARYAAKYEADACAAAAEAAgFgAAyQMAIAIAAADyAgAgFgAAyAMAIAacAQEAuAIAIaUBQAC7AgAhtQEBALgCACG9AQEAuAIAIb4BCADKAgAhvwEBANYCACEIBAAAmQMAIAoAAPUCACCcAQEAuAIAIaUBQAC7AgAhtQEBALgCACG9AQEAuAIAIb4BCADKAgAhvwEBANYCACEIBAAAmwMAIAoAAPgCACCcAQEAAAABpQFAAAAAAbUBAQAAAAG9AQEAAAABvgEIAAAAAb8BAQAAAAEQBAAAuQMAIAkAAJ4DACALAACfAwAgDAAAoAMAIJwBAQAAAAGkAQAAAMsBAqUBQAAAAAGmAUAAAAABtQEBAAAAAccBAQAAAAHIAQEAAAAByQEBAAAAAcsBAQAAAAHMAQgAAAABzQFAAAAAAc4BQAAAAAECAAAABQAgHQAA0wMAIAMAAAAFACAdAADTAwAgHgAA0gMAIAEWAAClBAAwAgAAAAUAIBYAANIDACACAAAAggMAIBYAANEDACAMnAEBALgCACGkAQAAhAPLASKlAUAAuwIAIaYBQAC7AgAhtQEBALgCACHHAQEAuAIAIcgBAQC4AgAhyQEBALgCACHLAQEAuAIAIcwBCADKAgAhzQFAAMwCACHOAUAAzAIAIRAEAAC3AwAgCQAAhwMAIAsAAIgDACAMAACJAwAgnAEBALgCACGkAQAAhAPLASKlAUAAuwIAIaYBQAC7AgAhtQEBALgCACHHAQEAuAIAIcgBAQC4AgAhyQEBALgCACHLAQEAuAIAIcwBCADKAgAhzQFAAMwCACHOAUAAzAIAIRAEAAC5AwAgCQAAngMAIAsAAJ8DACAMAACgAwAgnAEBAAAAAaQBAAAAywECpQFAAAAAAaYBQAAAAAG1AQEAAAABxwEBAAAAAcgBAQAAAAHJAQEAAAABywEBAAAAAcwBCAAAAAHNAUAAAAABzgFAAAAAAQQdAADLAwAw3AEAAMwDADDeAQAAzgMAIOIBAAD-AgAwBB0AAMIDADDcAQAAwwMAMN4BAADFAwAg4gEAAO4CADADHQAA0QIAINwBAADSAgAg4gEAAAEAIAQdAADAAgAw3AEAAMECADDeAQAAwwIAIOIBAADEAgAwAAAGBQAA_QMAIAgAANgDACANAADZAwAgDwAAjwQAIBAAAJAEACDSAQAA4wMAIAAAAAAAAAUdAACgBAAgHgAAowQAINwBAAChBAAg3QEAAKIEACDiAQAAAQAgAx0AAKAEACDcAQAAoQQAIOIBAAABACAAAAAAAAAAAAAAAAAAAAHfAQAAAMcBAgsdAADzAwAwHgAA9wMAMNwBAAD0AwAw3QEAAPUDADDeAQAA9gMAIN8BAAClAwAw4AEAAKUDADDhAQAApQMAMOIBAAClAwAw4wEAAPgDADDkAQAAqAMAMAsEAADiAwAgCAAAvAMAIJwBAQAAAAGlAUAAAAABtQEBAAAAAbcBAQAAAAG4AQEAAAABuQEBAAAAAboBCAAAAAG7AQEAAAABvAEgAAAAAQIAAAAJACAdAAD7AwAgAwAAAAkAIB0AAPsDACAeAAD6AwAgARYAAJ8EADACAAAACQAgFgAA-gMAIAIAAACpAwAgFgAA-QMAIAmcAQEAuAIAIaUBQAC7AgAhtQEBALgCACG3AQEAuAIAIbgBAQC4AgAhuQEBALgCACG6AQgAygIAIbsBAQC4AgAhvAEgAKsDACELBAAA4QMAIAgAAK4DACCcAQEAuAIAIaUBQAC7AgAhtQEBALgCACG3AQEAuAIAIbgBAQC4AgAhuQEBALgCACG6AQgAygIAIbsBAQC4AgAhvAEgAKsDACELBAAA4gMAIAgAALwDACCcAQEAAAABpQFAAAAAAbUBAQAAAAG3AQEAAAABuAEBAAAAAbkBAQAAAAG6AQgAAAABuwEBAAAAAbwBIAAAAAEEHQAA8wMAMNwBAAD0AwAw3gEAAPYDACDiAQAApQMAMAAAAAAAAAAAAAUdAACaBAAgHgAAnQQAINwBAACbBAAg3QEAAJwEACDiAQAAAQAgAx0AAJoEACDcAQAAmwQAIOIBAAABACAAAAAAAAUdAACVBAAgHgAAmAQAINwBAACWBAAg3QEAAJcEACDiAQAAxgEAIAMdAACVBAAg3AEAAJYEACDiAQAAxgEAIAQIAADYAwAgDAAA2wMAIA0AANkDACAOAADaAwAgAAcDAACPBAAgBAAA2gMAIAkAAJMEACALAADZAwAgDAAAlAQAIM0BAADjAwAgzgEAAOMDACACBQAA_QMAILkBAADjAwAgAwQAANoDACAHAACSBAAgCAAA2AMAIAMDAACPBAAgCgAAkQQAIMUBAADjAwAgDAgAANQDACAMAADXAwAgDQAA1QMAIJwBAQAAAAGdAQEAAAABngEBAAAAAZ8BAQAAAAGhAQAAAKEBAqIBAQAAAAGkAQAAAKQBAqUBQAAAAAGmAUAAAAABAgAAAMYBACAdAACVBAAgAwAAAMkBACAdAACVBAAgHgAAmQQAIA4AAADJAQAgCAAAvAIAIAwAAL8CACANAAC9AgAgFgAAmQQAIJwBAQC4AgAhnQEBALgCACGeAQEAuAIAIZ8BAQC4AgAhoQEAALkCoQEiogEBALgCACGkAQAAugKkASKlAUAAuwIAIaYBQAC7AgAhDAgAALwCACAMAAC_AgAgDQAAvQIAIJwBAQC4AgAhnQEBALgCACGeAQEAuAIAIZ8BAQC4AgAhoQEAALkCoQEiogEBALgCACGkAQAAugKkASKlAUAAuwIAIaYBQAC7AgAhDQUAAL4DACAIAAC_AwAgDQAAwAMAIA8AAI4EACCcAQEAAAABpQFAAAAAAaYBQAAAAAG3AQEAAAAB0gEBAAAAAdMBAgAAAAHUAQAAvQMAINUBAQAAAAHWAQgAAAABAgAAAAEAIB0AAJoEACADAAAAFgAgHQAAmgQAIB4AAJ4EACAPAAAAFgAgBQAA2QIAIAgAANoCACANAADbAgAgDwAAjQQAIBYAAJ4EACCcAQEAuAIAIaUBQAC7AgAhpgFAALsCACG3AQEAuAIAIdIBAQDWAgAh0wECANcCACHUAQAA2AIAINUBAQC4AgAh1gEIAMoCACENBQAA2QIAIAgAANoCACANAADbAgAgDwAAjQQAIJwBAQC4AgAhpQFAALsCACGmAUAAuwIAIbcBAQC4AgAh0gEBANYCACHTAQIA1wIAIdQBAADYAgAg1QEBALgCACHWAQgAygIAIQmcAQEAAAABpQFAAAAAAbUBAQAAAAG3AQEAAAABuAEBAAAAAbkBAQAAAAG6AQgAAAABuwEBAAAAAbwBIAAAAAENCAAAvwMAIA0AAMADACAPAACOBAAgEAAAwQMAIJwBAQAAAAGlAUAAAAABpgFAAAAAAbcBAQAAAAHSAQEAAAAB0wECAAAAAdQBAAC9AwAg1QEBAAAAAdYBCAAAAAECAAAAAQAgHQAAoAQAIAMAAAAWACAdAACgBAAgHgAApAQAIA8AAAAWACAIAADaAgAgDQAA2wIAIA8AAI0EACAQAADcAgAgFgAApAQAIJwBAQC4AgAhpQFAALsCACGmAUAAuwIAIbcBAQC4AgAh0gEBANYCACHTAQIA1wIAIdQBAADYAgAg1QEBALgCACHWAQgAygIAIQ0IAADaAgAgDQAA2wIAIA8AAI0EACAQAADcAgAgnAEBALgCACGlAUAAuwIAIaYBQAC7AgAhtwEBALgCACHSAQEA1gIAIdMBAgDXAgAh1AEAANgCACDVAQEAuAIAIdYBCADKAgAhDJwBAQAAAAGkAQAAAMsBAqUBQAAAAAGmAUAAAAABtQEBAAAAAccBAQAAAAHIAQEAAAAByQEBAAAAAcsBAQAAAAHMAQgAAAABzQFAAAAAAc4BQAAAAAEGnAEBAAAAAaUBQAAAAAG1AQEAAAABvQEBAAAAAb4BCAAAAAG_AQEAAAABBpwBAQAAAAGdAQEAAAABpAEAAADHAQKlAUAAAAABpgFAAAAAAbkBAQAAAAECAAAAawAgHQAApwQAIA0FAAC-AwAgDQAAwAMAIA8AAI4EACAQAADBAwAgnAEBAAAAAaUBQAAAAAGmAUAAAAABtwEBAAAAAdIBAQAAAAHTAQIAAAAB1AEAAL0DACDVAQEAAAAB1gEIAAAAAQIAAAABACAdAACpBAAgAwAAABYAIB0AAKkEACAeAACtBAAgDwAAABYAIAUAANkCACANAADbAgAgDwAAjQQAIBAAANwCACAWAACtBAAgnAEBALgCACGlAUAAuwIAIaYBQAC7AgAhtwEBALgCACHSAQEA1gIAIdMBAgDXAgAh1AEAANgCACDVAQEAuAIAIdYBCADKAgAhDQUAANkCACANAADbAgAgDwAAjQQAIBAAANwCACCcAQEAuAIAIaUBQAC7AgAhpgFAALsCACG3AQEAuAIAIdIBAQDWAgAh0wECANcCACHUAQAA2AIAINUBAQC4AgAh1gEIAMoCACEMnAEBAAAAAaQBAAAAywECpQFAAAAAAaYBQAAAAAG1AQEAAAABtwEBAAAAAcgBAQAAAAHJAQEAAAABywEBAAAAAcwBCAAAAAHNAUAAAAABzgFAAAAAAQMAAABuACAdAACnBAAgHgAAsQQAIAgAAABuACAWAACxBAAgnAEBALgCACGdAQEAuAIAIaQBAADxA8cBIqUBQAC7AgAhpgFAALsCACG5AQEA1gIAIQacAQEAuAIAIZ0BAQC4AgAhpAEAAPEDxwEipQFAALsCACGmAUAAuwIAIbkBAQDWAgAhCZwBAQAAAAGlAUAAAAABtgEBAAAAAbcBAQAAAAG4AQEAAAABuQEBAAAAAboBCAAAAAG7AQEAAAABvAEgAAAAAQwEAADiAwAgBwAAuwMAIJwBAQAAAAGlAUAAAAABtQEBAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAbkBAQAAAAG6AQgAAAABuwEBAAAAAbwBIAAAAAECAAAACQAgHQAAswQAIAwMAADXAwAgDQAA1QMAIA4AANYDACCcAQEAAAABnQEBAAAAAZ4BAQAAAAGfAQEAAAABoQEAAAChAQKiAQEAAAABpAEAAACkAQKlAUAAAAABpgFAAAAAAQIAAADGAQAgHQAAtQQAIA0FAAC-AwAgCAAAvwMAIA8AAI4EACAQAADBAwAgnAEBAAAAAaUBQAAAAAGmAUAAAAABtwEBAAAAAdIBAQAAAAHTAQIAAAAB1AEAAL0DACDVAQEAAAAB1gEIAAAAAQIAAAABACAdAAC3BAAgAwAAABYAIB0AALcEACAeAAC7BAAgDwAAABYAIAUAANkCACAIAADaAgAgDwAAjQQAIBAAANwCACAWAAC7BAAgnAEBALgCACGlAUAAuwIAIaYBQAC7AgAhtwEBALgCACHSAQEA1gIAIdMBAgDXAgAh1AEAANgCACDVAQEAuAIAIdYBCADKAgAhDQUAANkCACAIAADaAgAgDwAAjQQAIBAAANwCACCcAQEAuAIAIaUBQAC7AgAhpgFAALsCACG3AQEAuAIAIdIBAQDWAgAh0wECANcCACHUAQAA2AIAINUBAQC4AgAh1gEIAMoCACEGnAEBAAAAAaUBQAAAAAG1AQEAAAABtwEBAAAAAb4BCAAAAAG_AQEAAAABDAgAANQDACANAADVAwAgDgAA1gMAIJwBAQAAAAGdAQEAAAABngEBAAAAAZ8BAQAAAAGhAQAAAKEBAqIBAQAAAAGkAQAAAKQBAqUBQAAAAAGmAUAAAAABAgAAAMYBACAdAAC9BAAgAwAAAMkBACAdAAC9BAAgHgAAwQQAIA4AAADJAQAgCAAAvAIAIA0AAL0CACAOAAC-AgAgFgAAwQQAIJwBAQC4AgAhnQEBALgCACGeAQEAuAIAIZ8BAQC4AgAhoQEAALkCoQEiogEBALgCACGkAQAAugKkASKlAUAAuwIAIaYBQAC7AgAhDAgAALwCACANAAC9AgAgDgAAvgIAIJwBAQC4AgAhnQEBALgCACGeAQEAuAIAIZ8BAQC4AgAhoQEAALkCoQEiogEBALgCACGkAQAAugKkASKlAUAAuwIAIaYBQAC7AgAhAwAAAAcAIB0AALMEACAeAADEBAAgDgAAAAcAIAQAAOEDACAHAACtAwAgFgAAxAQAIJwBAQC4AgAhpQFAALsCACG1AQEAuAIAIbYBAQC4AgAhtwEBALgCACG4AQEAuAIAIbkBAQC4AgAhugEIAMoCACG7AQEAuAIAIbwBIACrAwAhDAQAAOEDACAHAACtAwAgnAEBALgCACGlAUAAuwIAIbUBAQC4AgAhtgEBALgCACG3AQEAuAIAIbgBAQC4AgAhuQEBALgCACG6AQgAygIAIbsBAQC4AgAhvAEgAKsDACEDAAAAyQEAIB0AALUEACAeAADHBAAgDgAAAMkBACAMAAC_AgAgDQAAvQIAIA4AAL4CACAWAADHBAAgnAEBALgCACGdAQEAuAIAIZ4BAQC4AgAhnwEBALgCACGhAQAAuQKhASKiAQEAuAIAIaQBAAC6AqQBIqUBQAC7AgAhpgFAALsCACEMDAAAvwIAIA0AAL0CACAOAAC-AgAgnAEBALgCACGdAQEAuAIAIZ4BAQC4AgAhnwEBALgCACGhAQAAuQKhASKiAQEAuAIAIaQBAAC6AqQBIqUBQAC7AgAhpgFAALsCACEMnAEBAAAAAaQBAAAAywECpQFAAAAAAaYBQAAAAAG3AQEAAAABxwEBAAAAAcgBAQAAAAHJAQEAAAABywEBAAAAAcwBCAAAAAHNAUAAAAABzgFAAAAAAQwIAADUAwAgDAAA1wMAIA4AANYDACCcAQEAAAABnQEBAAAAAZ4BAQAAAAGfAQEAAAABoQEAAAChAQKiAQEAAAABpAEAAACkAQKlAUAAAAABpgFAAAAAAQIAAADGAQAgHQAAyQQAIBEDAACdAwAgBAAAuQMAIAkAAJ4DACAMAACgAwAgnAEBAAAAAaQBAAAAywECpQFAAAAAAaYBQAAAAAG1AQEAAAABtwEBAAAAAccBAQAAAAHIAQEAAAAByQEBAAAAAcsBAQAAAAHMAQgAAAABzQFAAAAAAc4BQAAAAAECAAAABQAgHQAAywQAIAMAAADJAQAgHQAAyQQAIB4AAM8EACAOAAAAyQEAIAgAALwCACAMAAC_AgAgDgAAvgIAIBYAAM8EACCcAQEAuAIAIZ0BAQC4AgAhngEBALgCACGfAQEAuAIAIaEBAAC5AqEBIqIBAQC4AgAhpAEAALoCpAEipQFAALsCACGmAUAAuwIAIQwIAAC8AgAgDAAAvwIAIA4AAL4CACCcAQEAuAIAIZ0BAQC4AgAhngEBALgCACGfAQEAuAIAIaEBAAC5AqEBIqIBAQC4AgAhpAEAALoCpAEipQFAALsCACGmAUAAuwIAIQMAAAADACAdAADLBAAgHgAA0gQAIBMAAAADACADAACGAwAgBAAAtwMAIAkAAIcDACAMAACJAwAgFgAA0gQAIJwBAQC4AgAhpAEAAIQDywEipQFAALsCACGmAUAAuwIAIbUBAQC4AgAhtwEBALgCACHHAQEAuAIAIcgBAQC4AgAhyQEBALgCACHLAQEAuAIAIcwBCADKAgAhzQFAAMwCACHOAUAAzAIAIREDAACGAwAgBAAAtwMAIAkAAIcDACAMAACJAwAgnAEBALgCACGkAQAAhAPLASKlAUAAuwIAIaYBQAC7AgAhtQEBALgCACG3AQEAuAIAIccBAQC4AgAhyAEBALgCACHJAQEAuAIAIcsBAQC4AgAhzAEIAMoCACHNAUAAzAIAIc4BQADMAgAhBpwBAQAAAAGlAUAAAAABtwEBAAAAAb0BAQAAAAG-AQgAAAABvwEBAAAAAQecAQEAAAABpAEAAADSAQKlAUAAAAABpgFAAAAAAcsBAQAAAAHPAQEAAAAB0AEBAAAAAREDAACdAwAgBAAAuQMAIAkAAJ4DACALAACfAwAgnAEBAAAAAaQBAAAAywECpQFAAAAAAaYBQAAAAAG1AQEAAAABtwEBAAAAAccBAQAAAAHIAQEAAAAByQEBAAAAAcsBAQAAAAHMAQgAAAABzQFAAAAAAc4BQAAAAAECAAAABQAgHQAA1QQAIAMAAAADACAdAADVBAAgHgAA2QQAIBMAAAADACADAACGAwAgBAAAtwMAIAkAAIcDACALAACIAwAgFgAA2QQAIJwBAQC4AgAhpAEAAIQDywEipQFAALsCACGmAUAAuwIAIbUBAQC4AgAhtwEBALgCACHHAQEAuAIAIcgBAQC4AgAhyQEBALgCACHLAQEAuAIAIcwBCADKAgAhzQFAAMwCACHOAUAAzAIAIREDAACGAwAgBAAAtwMAIAkAAIcDACALAACIAwAgnAEBALgCACGkAQAAhAPLASKlAUAAuwIAIaYBQAC7AgAhtQEBALgCACG3AQEAuAIAIccBAQC4AgAhyAEBALgCACHJAQEAuAIAIcsBAQC4AgAhzAEIAMoCACHNAUAAzAIAIc4BQADMAgAhCJwBAQAAAAGkAQAAAMQBAqUBQAAAAAG9AQEAAAABwAEBAAAAAcIBCAAAAAHEAQEAAAABxQFAAAAAAQYFHgQGAA0IHwMNIAgPAAIQJAwFBgALCAYDDBoJDRUIDhcBBgMAAgQAAQYACgkABAsRCAwTCQQEAAEGAAcHAAUIDAMCBQoEBgAGAQULAAEIDQADAwACBAABCgADAgMAAgoAAwELFAADCBsADB0ADRwAAQQAAQQFJQAIJgANJwAQKAAAAQ8AAgEPAAIFBgASIwATJAAUJQAVJgAWAAAAAAAFBgASIwATJAAUJQAVJgAWAQQAAQEEAAEDBgAbJQAcJgAdAAAAAwYAGyUAHCYAHQMDAAIEAAEJAAQDAwACBAABCQAEBQYAIiMAIyQAJCUAJSYAJgAAAAAABQYAIiMAIyQAJCUAJSYAJgAAAwYAKyUALCYALQAAAAMGACslACwmAC0CAwACCgADAgMAAgoAAwUGADIjADMkADQlADUmADYAAAAAAAUGADIjADMkADQlADUmADYDAwACBAABCgADAwMAAgQAAQoAAwUGADsjADwkAD0lAD4mAD8AAAAAAAUGADsjADwkAD0lAD4mAD8CBAABBwAFAgQAAQcABQUGAEQjAEUkAEYlAEcmAEgAAAAAAAUGAEQjAEUkAEYlAEcmAEgAAAMGAE0lAE4mAE8AAAADBgBNJQBOJgBPEQIBEikBEysBFCwBFS0BFy8BGDEOGTIPGjQBGzYOHDcQHzgBIDkBIToOJz0RKD4XKT8MKkAMK0EMLEIMLUMMLkUML0cOMEgYMUoMMkwOM00ZNE4MNU8MNlAON1MaOFQeOVUDOlYDO1cDPFgDPVkDPlsDP10OQF4fQWADQmIOQ2MgRGQDRWUDRmYOR2khSGonSWwFSm0FS3AFTHEFTXIFTnQFT3YOUHcoUXkFUnsOU3wpVH0FVX4FVn8OV4IBKliDAS5ZhAEJWoUBCVuGAQlchwEJXYgBCV6KAQlfjAEOYI0BL2GPAQlikQEOY5IBMGSTAQlllAEJZpUBDmeYATFomQE3aZoBCGqbAQhrnAEIbJ0BCG2eAQhuoAEIb6IBDnCjAThxpQEIcqcBDnOoATl0qQEIdaoBCHarAQ53rgE6eK8BQHmwAQR6sQEEe7IBBHyzAQR9tAEEfrYBBH-4AQ6AAbkBQYEBuwEEggG9AQ6DAb4BQoQBvwEEhQHAAQSGAcEBDocBxAFDiAHFAUmJAccBAooByAECiwHLAQKMAcwBAo0BzQECjgHPAQKPAdEBDpAB0gFKkQHUAQKSAdYBDpMB1wFLlAHYAQKVAdkBApYB2gEOlwHdAUyYAd4BUA"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var CategoryStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
};
var BookingStatus = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  IN_PROGRESS: "IN_PROGRESS"
};
var Role = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN"
};
var UserStatus = {
  UNBAN: "UNBAN",
  BAN: "BAN"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  CANCELLED: "CANCELLED"
};
var AvailabilityStatus = {
  Available: "Available",
  Booked: "Booked",
  Blocked: "Blocked"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/module/auth/auth.service.ts
import bcrypt from "bcryptjs";

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  try {
    const token = jwt.sign(payload, secret, expiresIn);
    return token;
  } catch (error) {
    console.log(error);
  }
};
var verifyToken = (token, secret) => {
  try {
    const verifedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifedToken
    };
  } catch (error) {
    console.log("Token verifed falied", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/module/auth/auth.service.ts
var AuthService = class {
  async createdb(payload) {
    {
      const { email, password, name, role, profilePhoto } = payload;
      const userexits = await prisma.users.findUnique({ where: { email } });
      if (userexits) {
        throw new Error("This email Allready exits");
      }
      const hashedPassword = await bcrypt.hash(
        password,
        Number(config_default.bycriptHashRound)
      );
      const user = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          profilePhoto
        },
        omit: { password: true }
      });
      if (user && user.status === UserStatus.UNBAN) {
        const jwtpayload = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        const accessToken = jwtUtils.createToken(
          jwtpayload,
          config_default.accessSecret,
          { expiresIn: config_default.jwt_refresh_Expires }
        );
        const refreshToken = jwtUtils.createToken(
          jwtpayload,
          config_default.refreshSecret,
          { expiresIn: config_default.jwt_refresh_Expires }
        );
        return { accessToken, refreshToken, user };
      }
    }
  }
  async logindb(payload) {
    const { email, password } = payload;
    const userExits = await prisma.users.findUnique({ where: { email } });
    if (userExits?.status === "BAN") {
      throw new Error("This user is Ban ! pleace try again");
    }
    if (!userExits) {
      throw new Error("This email is not found");
    }
    const passwordMatch = await bcrypt.compare(password, userExits.password);
    console.log("password", passwordMatch);
    if (!passwordMatch) {
      throw new Error("password does not match! please try again");
    }
    const jwtpayload = {
      id: userExits.id,
      name: userExits.name,
      email: userExits.email,
      role: userExits.role
    };
    const accessToken = jwtUtils.createToken(jwtpayload, config_default.accessSecret, {
      expiresIn: config_default.jwt_refresh_Expires
    });
    const refreshToken = jwtUtils.createToken(
      jwtpayload,
      config_default.refreshSecret,
      { expiresIn: config_default.jwt_refresh_Expires }
    );
    return { accessToken, refreshToken, role: userExits.role };
  }
  async meDB(payload) {
    const { id, email, role, name } = payload;
    const result = await prisma.users.findUnique({
      where: {
        id,
        email,
        name,
        role
      },
      omit: { password: true },
      include: { technicianProfile: true }
    });
    return result;
  }
};
var auth_service_default = new AuthService();

// src/module/auth/auth.controller.ts
import status2 from "http-status";
var AuthController = class extends baseController {
  createUser = this.handle(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_default.createdb(payload);
    if (!result) {
      throw new Error("User creation failed");
    }
    const { accessToken, refreshToken, user } = result;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 24 hour or 7 day
    });
    sendResponse(res, {
      success: true,
      message: "user created successfully",
      status: status2.CREATED,
      data: { accessToken, refreshToken, user }
    });
  });
  loginUser = this.handle(async (req, res) => {
    const payload = req.body;
    const { accessToken, refreshToken, role } = await auth_service_default.logindb(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 24 hour or 7 day
    });
    sendResponse(res, {
      success: true,
      message: "user logged in successfully",
      status: status2.CREATED,
      data: { accessToken, refreshToken, role }
    });
  });
  meget = this.handle(async (req, res) => {
    const payload = req.user;
    const user = await auth_service_default.meDB(payload);
    sendResponse(res, {
      success: true,
      message: "user is found",
      status: status2.CREATED,
      data: user
    });
  });
};
var auth_controller_default = new AuthController();

// src/midieware/auth.ts
import status3 from "http-status";
var auth = (...requriedRoles) => {
  return async function(req, res, next) {
    try {
      const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
      if (!token) {
        throw new Error(
          "You are not logged in. Please log in to access this resource."
        );
      }
      const verifedToken = jwtUtils.verifyToken(token, config_default.accessSecret);
      if (!verifedToken.success) {
        throw new Error(verifedToken.error);
      }
      const { id, name, email, role } = verifedToken.data;
      if (requriedRoles.length && !requriedRoles.includes(role)) {
        throw new Error(
          "Forbidden. You don't have permission to access this resource."
        );
      }
      const user = await prisma.users.findUnique({
        where: {
          id,
          name,
          email,
          role
        }
      });
      if (!user) {
        throw new Error("User not found. Please log in again.");
      }
      req.user = {
        email,
        name,
        id,
        role
      };
      next();
    } catch (error) {
      console.log("Auth Error:", error);
      sendResponse(res, {
        success: false,
        status: status3.INTERNAL_SERVER_ERROR,
        message: error instanceof Error ? error.message : "Authentication failed"
      });
    }
  };
};

// src/midieware/validationReq.ts
import { ZodError } from "zod";
import status4 from "http-status";
var validationReq = (schema) => {
  return (req, res, next) => {
    try {
      const data = schema.parse({
        body: req.body
      });
      req.body = data.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(status4.BAD_REQUEST).json({
          success: false,
          status: status4.BAD_REQUEST,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }
      return res.status(status4.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: status4.INTERNAL_SERVER_ERROR,
        message: "Internal server error"
      });
    }
  };
};
var validationReq_default = validationReq;

// src/module/auth/auth.validation.ts
import { z } from "zod";
var userLoginValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
    email: z.string().trim().min(1, "Email is required").refine(
      (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      {
        message: "Email is not valid"
      }
    ),
    password: z.string().trim().superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({
          code: "custom",
          message: "Password is required"
        });
        return;
      }
      if (value.length < 6) {
        ctx.addIssue({
          code: "custom",
          message: "Password must be at least 6 characters"
        });
      }
    }),
    role: z.enum(["CUSTOMER", "TECHNICIAN"], {
      message: "Role must be CUSTOMER, TECHNICIAN"
    }),
    profilePhoto: z.string().url("Invalid profile photo URL").optional()
  })
});
var authValidation = {
  userLoginValidationSchema
};

// src/module/auth/auth.route.ts
var router = Router();
router.post("/register", validationReq_default(authValidation.userLoginValidationSchema), auth_controller_default.createUser);
router.post("/login", auth_controller_default.loginUser);
router.get("/me", auth("CUSTOMER", "ADMIN", "TECHNICIAN"), auth_controller_default.meget);
var authRouter = router;

// src/module/tecnichian/tecnichian.route.ts
import { Router as Router2 } from "express";

// src/module/tecnichian/tecnichian.service.ts
var TecnichianService = class {
  async profiledb(payload) {
    const { userId, bio, skills, location, yearsOfExperience } = payload;
    const profileExits = await prisma.technicianProfile.findUnique({
      where: { userId }
    });
    if (profileExits) {
      throw new Error("This id profile allready exits");
    }
    const result = await prisma.technicianProfile.create({
      data: {
        userId,
        bio,
        skills,
        location,
        yearsOfExperience
      }
    });
    return result;
  }
  async updateprofiledb(payload) {
    const { userId, bio, skills, location, yearsOfExperience, profilePhoto } = payload;
    const profileExits = await prisma.technicianProfile.findUnique({
      where: { userId }
    });
    if (!profileExits) {
      throw new Error("This  profile not exits");
    }
    const result = await prisma.$transaction(async (x) => {
      const user = await x.users.update({
        where: { id: userId },
        data: { profilePhoto },
        omit: {
          password: true
        }
      });
      const profile = await x.technicianProfile.update({
        where: { id: profileExits.id },
        data: {
          userId,
          bio,
          skills,
          location,
          yearsOfExperience
        }
      });
      return { user, profile };
    });
    return result;
  }
  async getAlltecnichiandb(query) {
    const {
      location,
      skills,
      yearsOfExperience
    } = query;
    const results = await prisma.technicianProfile.findMany({
      where: {
        ...location && {
          location: {
            contains: location,
            mode: "insensitive"
          }
        },
        ...skills && {
          skills: {
            has: skills
          }
        },
        ...yearsOfExperience && {
          yearsOfExperience: Number(yearsOfExperience)
        }
      },
      include: {
        reviews: true,
        bookings: true,
        availabilities: true,
        technician: true
      }
    });
    return results;
  }
  async gettecnichianDashboarddb(userId) {
    const technichianexits = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!technichianexits) {
      throw new Error("Tecnishan not Found!Pleace create your tecnishian account");
    }
    const now = /* @__PURE__ */ new Date();
    const currentYear = now.getFullYear();
    const [totalRevunue, reqBookingCount, completeBooking, avalibileBookingCount, booking] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: PaymentStatus.PAID,
          booking: {
            technicianId: technichianexits.id
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.booking.count({ where: { technicianId: technichianexits.id, status: BookingStatus.REQUESTED } }),
      prisma.booking.count({ where: { technicianId: technichianexits.id, status: BookingStatus.COMPLETED } }),
      prisma.availability.count({ where: { technicianId: technichianexits.id, status: AvailabilityStatus.Available } }),
      prisma.booking.findMany({
        where: {
          technicianId: technichianexits?.id
        },
        include: {
          customer: {
            select: {
              name: true
            }
          },
          service: {
            include: {
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    ]);
    const revenueData = await Promise.all(
      Array.from({ length: 12 }, async (_, i) => {
        const monthStart = new Date(
          currentYear,
          i,
          1
        );
        const monthEnd = new Date(
          currentYear,
          i + 1,
          1
        );
        const result = await prisma.payment.aggregate({
          where: {
            status: PaymentStatus.PAID,
            booking: {
              technicianId: technichianexits?.id
            },
            paidAt: {
              gte: monthStart,
              lt: monthEnd
            }
          },
          _sum: {
            amount: true
          }
        });
        return {
          month: monthStart.toLocaleString("en-US", {
            month: "short"
          }),
          revenue: result._sum.amount ?? 0
        };
      })
    );
    return {
      revenueData,
      totalRevunue,
      reqBookingCount,
      completeBooking,
      booking,
      avalibileBookingCount
    };
  }
  async createAvabilitydb(payload, userId) {
    console.log("abalibilty", payload);
    const technichianExit = await prisma.technicianProfile.findUniqueOrThrow({ where: { userId } });
    console.log("technishin profile", technichianExit);
    const results = await prisma.availability.create({ data: {
      ...payload,
      technicianId: technichianExit.id
    } });
    return results;
  }
  async BookingsUpdateStatus(payload, id, userId) {
    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: { userId }
    });
    if (!technicianProfile) {
      throw new Error("Technician profile not found");
    }
    const bookingExists = await prisma.booking.findUnique({
      where: {
        id,
        technicianId: technicianProfile.id
      }
    });
    if (!bookingExists) {
      throw new Error("Booking not found or unauthorized");
    }
    const results = await prisma.booking.update({
      where: { id, technicianId: technicianProfile.id },
      data: {
        ...payload,
        completedAt: payload.status === BookingStatus.COMPLETED ? /* @__PURE__ */ new Date() : null,
        cancelledAt: payload.status === BookingStatus.CANCELLED ? /* @__PURE__ */ new Date() : null
      }
    });
    return results;
  }
  async getAllBokingsTecnichiandb(userId) {
    const technicianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });
    console.log("technishanPRofile", technicianProfile);
    if (!technicianProfile) {
      throw new Error("This tecnishian not found pleace update your tecnishian");
    }
    const results = await prisma.booking.findMany({
      where: { technicianId: technicianProfile.id },
      include: {
        payment: true
      }
    });
    return results;
  }
  async getMyServicedb(userId) {
    const technicianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!technicianProfile) {
      throw new Error("This tecnishian not found pleace create  tecnishian");
    }
    const results = await prisma.service.findMany({ where: { technicianId: technicianProfile.id } });
    return results;
  }
  async getAvabilityDB(userId, query) {
    const technichianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!technichianProfile) {
      throw new Error("Technician profile not found");
    }
    const { id } = technichianProfile;
    const results = await prisma.availability.findMany({
      where: {
        technicianId: id
      }
    });
    return results;
  }
  async getAvableSlotDB(date) {
    const results = await prisma.availability.findMany({
      where: {
        date
      },
      select: {
        id: true,
        startTime: true,
        endTime: true
      }
    });
    return results;
  }
  async updateAvabiltilyDB(payload, userId) {
    const technichianProfile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!technichianProfile) {
      throw new Error("Technician profile not found");
    }
    console.log("payload avalibilty", payload);
    const { id, status: status8 } = payload;
    const result = await prisma.availability.update({ where: { id }, data: { status: status8 } });
    return result;
  }
};
var tecnichian_service_default = new TecnichianService();

// src/module/tecnichian/tecnichian.controller.ts
import status5 from "http-status";
var TecnichianController = class extends baseController {
  tecnProfile = this.handle(async (req, res) => {
    const payload = req.body;
    const id = req.user?.id;
    const profilepayload = { ...payload, userId: id };
    console.log("profile technichian", profilepayload);
    const user = await tecnichian_service_default.profiledb(profilepayload);
    sendResponse(res, {
      success: true,
      message: "user created successfully",
      status: status5.CREATED,
      data: user
    });
  });
  updatetechnicianProfile = this.handle(async (req, res) => {
    const payload = req.body;
    const id = req.user?.id;
    const profilepayload = { ...payload, userId: id };
    console.log("profile technichian", profilepayload);
    const user = await tecnichian_service_default.updateprofiledb(profilepayload);
    sendResponse(res, {
      success: true,
      message: "Profile Update successfully",
      status: status5.CREATED,
      data: user
    });
  });
  getAlltecnishian = this.handle(async (req, res) => {
    const query = req.query;
    const tecnichian = await tecnichian_service_default.getAlltecnichiandb(query);
    sendResponse(res, {
      message: "get all tecnishian found",
      success: true,
      status: status5.OK,
      data: tecnichian
    });
  });
  gettecnishianDashboard = this.handle(async (req, res) => {
    const userId = req?.user?.id;
    const tecnichian = await tecnichian_service_default.gettecnichianDashboarddb(userId);
    sendResponse(res, {
      message: "get all tecnishian found",
      success: true,
      status: status5.OK,
      data: tecnichian
    });
  });
  createAvalibility = this.handle(async (req, res) => {
    const payload = req.body;
    const userId = req.user?.id;
    const availability = await tecnichian_service_default.createAvabilitydb(
      payload,
      userId
    );
    sendResponse(res, {
      message: "availabililty created is successfully",
      success: true,
      status: status5.OK,
      data: availability
    });
  });
  updateBookingsStatus = this.handle(async (req, res) => {
    const payload = req.body;
    const id = req.params.id;
    const userId = req.user?.id;
    const reuslts = await tecnichian_service_default.BookingsUpdateStatus(
      payload,
      id,
      userId
    );
    sendResponse(res, {
      message: `bookings is ${payload.status}`,
      success: true,
      status: status5.OK,
      data: reuslts
    });
  });
  getAllBookingsTecnichian = this.handle(
    async (req, res) => {
      console.log("users", req.user);
      const userId = req.user?.id;
      console.log("userId ", userId);
      const bookings = await tecnichian_service_default.getAllBokingsTecnichiandb(userId);
      sendResponse(res, {
        success: true,
        message: "all  bookings tecnichian get  is successfully",
        status: status5.CREATED,
        data: bookings
      });
    }
  );
  getAvailability = this.handle(async (req, res) => {
    const query = req.query;
    const userId = req.user?.id;
    console.log("userId", userId);
    console.log("user", req.user);
    const availabililty = await tecnichian_service_default.getAvabilityDB(userId, query);
    sendResponse(res, {
      success: true,
      message: "availability is found",
      status: status5.OK,
      data: availabililty
    });
  });
  getAvailabieSlot = this.handle(async (req, res) => {
    const { date } = req.params;
    console.log("id date", date);
    const availabililty = await tecnichian_service_default.getAvableSlotDB(date);
    sendResponse(res, {
      success: true,
      message: "availability is found",
      status: status5.OK,
      data: availabililty
    });
  });
  updateAvailability = this.handle(async (req, res) => {
    const payload = req.body;
    const userId = req.user?.id;
    const updateAvailability = await tecnichian_service_default.updateAvabiltilyDB(
      payload,
      userId
    );
    sendResponse(res, {
      success: true,
      message: "availability updated",
      status: status5.OK,
      data: updateAvailability
    });
  });
  getMyService = this.handle(
    async (req, res) => {
      console.log("users", req.user);
      const userId = req.user?.id;
      console.log("userId ", userId);
      const bookings = await tecnichian_service_default.getMyServicedb(userId);
      sendResponse(res, {
        success: true,
        message: "all  Service tecnichian get  is successfully",
        status: status5.OK,
        data: bookings
      });
    }
  );
};
var tecnichian_controller_default = new TecnichianController();

// src/module/tecnichian/tecnichian.validation.ts
import { z as z2 } from "zod";
var technicianProfileValidationSchema = z2.object({
  body: z2.object({
    bio: z2.string().trim().min(10, "Bio must be at least 10 characters").max(1e3, "Bio must not exceed 1000 characters"),
    yearsOfExperience: z2.number({
      message: "Years of experience must be a number"
    }).int("Years of experience must be a whole number").min(0, "Years of experience cannot be negative").max(50, "Years of experience must not exceed 50 years"),
    skills: z2.array(
      z2.string().trim().min(1, "Skill cannot be empty")
    ).min(1, "At least one skill is required").max(20, "You can add a maximum of 20 skills"),
    location: z2.string().trim().min(1, "Location is required").max(200, "Location must not exceed 200 characters"),
    profilePhoto: z2.string().url("Invalid profile photo URL").optional()
  })
});
var updateTechnicianProfileValidationSchema = z2.object({
  body: z2.object({
    bio: z2.string().trim().min(10, "Bio must be at least 10 characters").max(1e3, "Bio must not exceed 1000 characters"),
    yearsOfExperience: z2.number({
      message: "Years of experience must be a number"
    }).int("Years of experience must be a whole number").min(0, "Years of experience cannot be negative").max(50, "Years of experience must not exceed 50 years"),
    skills: z2.array(
      z2.string().trim().min(1, "Skill cannot be empty")
    ).min(1, "At least one skill is required").max(20, "You can add a maximum of 20 skills"),
    location: z2.string().trim().min(1, "Location is required").max(200, "Location must not exceed 200 characters"),
    // Image optional
    profilePhoto: z2.string().url("Invalid profile photo URL").optional()
  })
});
var updateBookingStatusValidationSchema = z2.object({
  body: z2.object({
    status: z2.enum(BookingStatus, {
      message: "Status must be REQUESTED, ACCEPTED, COMPLETED or CANCELLED"
    })
  })
});
var technicianValidation = {
  technicianProfileValidationSchema,
  updateTechnicianProfileValidationSchema,
  updateBookingStatusValidationSchema
};

// src/module/tecnichian/tecnichian.route.ts
var router2 = Router2();
router2.post(
  "/profile",
  validationReq_default(technicianValidation.technicianProfileValidationSchema),
  auth("TECHNICIAN"),
  tecnichian_controller_default.tecnProfile
);
router2.patch(
  "/profile-update",
  validationReq_default(technicianValidation.updateTechnicianProfileValidationSchema),
  auth("TECHNICIAN"),
  tecnichian_controller_default.updatetechnicianProfile
);
router2.get("/", tecnichian_controller_default.getAlltecnishian);
router2.post("/availability", auth("TECHNICIAN"), tecnichian_controller_default.createAvalibility);
router2.get("/availability", auth("TECHNICIAN"), tecnichian_controller_default.getAvailability);
router2.get("/availableSlot/:date", tecnichian_controller_default.getAvailabieSlot);
router2.put("/availability", auth("TECHNICIAN"), tecnichian_controller_default.updateAvailability);
router2.patch(
  "/bookings/:id",
  validationReq_default(technicianValidation.updateBookingStatusValidationSchema),
  auth("TECHNICIAN"),
  tecnichian_controller_default.updateBookingsStatus
);
router2.get("/bookings", auth("TECHNICIAN"), tecnichian_controller_default.getAllBookingsTecnichian);
router2.get("/my-service", auth("TECHNICIAN"), tecnichian_controller_default.getMyService);
router2.get("/dashboard", auth("TECHNICIAN"), tecnichian_controller_default.gettecnishianDashboard);
var technicianRouter = router2;

// src/module/admin/admin.route.ts
import { Router as Router3 } from "express";

// src/module/admin/admin.service.ts
var AdminService = class {
  async categoryCreatedb(payload) {
    const result = await prisma.category.create({ data: payload });
    return result;
  }
  async getAllCategorydb(search) {
    const whereCondition = {};
    const normalizedSearch = typeof search === "string" && search !== "undefined" ? search.trim() : "";
    if (normalizedSearch) {
      whereCondition.OR = [
        {
          name: {
            contains: normalizedSearch,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: normalizedSearch,
            mode: "insensitive"
          }
        }
      ];
    }
    const [allcategory, totalCategoryCount, activeCategoryCount, inactiveCategoryCount] = await Promise.all([
      prisma.category.findMany({
        where: whereCondition,
        include: {
          _count: {
            select: {
              services: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.category.count(),
      prisma.category.count({ where: { status: CategoryStatus.ACTIVE } }),
      prisma.category.count({ where: { status: CategoryStatus.INACTIVE } })
    ]);
    return {
      allcategory,
      totalCategoryCount,
      activeCategoryCount,
      inactiveCategoryCount
    };
  }
  async updatecategoreydb(payload, id) {
    const result = await prisma.category.update({ where: { id }, data: payload });
    return result;
  }
  async deletecategoreydb(id) {
    const result = await prisma.category.delete({ where: { id } });
    return result;
  }
  async getAllUsersdb(query) {
    const { search, page } = query;
    console.log("searach", search, "page", page);
    const whereCondition = {};
    const normalizedPage = typeof page === "string" && page !== "undefined" ? Number(page) : 1;
    const normalizedSearch = typeof search === "string" && search !== "undefined" ? search.trim() : "";
    if (normalizedSearch) {
      whereCondition.OR = [
        {
          name: {
            contains: normalizedSearch,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: normalizedSearch,
            mode: "insensitive"
          }
        }
      ];
      const roleValue = normalizedSearch.toUpperCase();
      if (roleValue === "ADMIN" || roleValue === "CUSTOMER" || roleValue === "TECHNICIAN") {
        whereCondition.OR.push({
          role: roleValue
        });
      }
    }
    const limit = 6;
    const pageNumber = Number(normalizedPage) || 1;
    const skip = (pageNumber - 1) * limit;
    const [users, totalUserCount] = await Promise.all([
      prisma.users.findMany({
        where: whereCondition,
        skip,
        take: limit
      }),
      prisma.users.count({ where: whereCondition })
    ]);
    return { users, totalUserCount, pageNumber, limit };
  }
  async getAdminDashboarddb() {
    const now = /* @__PURE__ */ new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const currentYear = now.getFullYear();
    const [
      totalUser,
      registerUser,
      totaltechnician,
      runingMonthBooking,
      activeBookingCount,
      bookingAll,
      revenueResult
    ] = await Promise.all([
      // Total users
      prisma.users.count(),
      // Total customers
      prisma.users.count({
        where: {
          role: Role.CUSTOMER
        }
      }),
      // Total technicians
      prisma.technicianProfile.count(),
      // Current month bookings
      prisma.booking.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lt: startOfNextMonth
          }
        }
      }),
      // Active bookings
      prisma.booking.count({
        where: {
          status: {
            in: [
              BookingStatus.REQUESTED,
              BookingStatus.ACCEPTED,
              BookingStatus.IN_PROGRESS
            ]
          }
        }
      }),
      // Active booking list
      prisma.booking.findMany({
        where: {
          status: {
            in: [
              BookingStatus.REQUESTED,
              BookingStatus.ACCEPTED,
              BookingStatus.IN_PROGRESS
            ]
          }
        },
        include: {
          customer: {
            select: {
              name: true
            }
          },
          service: {
            include: {
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }),
      // Total revenue
      prisma.payment.aggregate({
        where: {
          status: PaymentStatus.PAID
        },
        _sum: {
          amount: true
        }
      })
    ]);
    const revenue = revenueResult._sum.amount ?? 0;
    const revenueData = await Promise.all(
      Array.from({ length: 12 }, async (_, i) => {
        const monthStart = new Date(
          currentYear,
          i,
          1
        );
        const monthEnd = new Date(
          currentYear,
          i + 1,
          1
        );
        const result = await prisma.payment.aggregate({
          where: {
            status: PaymentStatus.PAID,
            paidAt: {
              gte: monthStart,
              lt: monthEnd
            }
          },
          _sum: {
            amount: true
          }
        });
        return {
          month: monthStart.toLocaleString("en-US", {
            month: "short"
          }),
          revenue: result._sum.amount ?? 0
        };
      })
    );
    return {
      totalUser,
      activeBookingCount,
      revenue,
      bookingAll,
      registerUser,
      totaltechnician,
      runingMonthBooking,
      revenueData
    };
  }
  async getAllBookingsdb() {
    const result = await prisma.booking.findMany();
    return result;
  }
  async updateUserStatusDB(status8, id) {
    const result = await prisma.users.update({
      where: { id },
      data: { status: status8 }
    });
    return result;
  }
};
var admin_service_default = new AdminService();

// src/module/admin/admin.controller.ts
import statuscode from "http-status";
var AdminCotroller = class extends baseController {
  category = this.handle(async (req, res) => {
    const payload = req.body;
    const category = await admin_service_default.categoryCreatedb(payload);
    sendResponse(res, { message: "Category created successfully", status: statuscode.CREATED, success: true, data: category });
  });
  getAllCategory = this.handle(async (req, res) => {
    const { search } = req.query;
    console.log("server search", search);
    const category = await admin_service_default.getAllCategorydb(search);
    sendResponse(res, { message: "get all category", status: statuscode.OK, success: true, data: category });
  });
  getAdminDashboard = this.handle(async (req, res) => {
    const result = await admin_service_default.getAdminDashboarddb();
    sendResponse(res, { message: "get all category", status: statuscode.OK, success: true, data: result });
  });
  updateCategory = this.handle(async (req, res) => {
    const payload = req.body;
    const id = req.params?.id;
    const category = await admin_service_default.updatecategoreydb(payload, id);
    sendResponse(res, { message: "Category updated successfully", status: statuscode.OK, success: true, data: category });
  });
  getAllUsers = this.handle(async (req, res) => {
    const query = req.query;
    const users = await admin_service_default.getAllUsersdb(query);
    sendResponse(res, { message: "Get all users", status: statuscode.OK, success: true, data: users });
  });
  getAllBookings = this.handle(async (req, res) => {
    const booking = await admin_service_default.getAllBookingsdb();
    sendResponse(res, { message: "Get all bookings", status: statuscode.OK, success: true, data: booking });
  });
  userStatusUpdate = this.handle(async (req, res) => {
    const { status: status8 } = req.body;
    console.log("status user", status8);
    const id = req.params.id;
    const result = await admin_service_default.updateUserStatusDB(status8, id);
    console.log({ message: " update Status Successfully", status: statuscode.OK, success: true, data: result });
    sendResponse(res, { message: "update Status Successfully", status: statuscode.OK, success: true, data: result });
  });
};
var admin_controller_default = new AdminCotroller();

// src/module/admin/admin.validation.ts
import { z as z3 } from "zod";
var createCategoryValidationSchema = z3.object({
  body: z3.object({
    name: z3.string().trim().min(1, "Category name is required").min(2, "Category name must be at least 2 characters").max(100, "Category name must not exceed 100 characters"),
    description: z3.string().trim().min(1, "Description is required").min(10, "Description must be at least 10 characters").max(500, "Description must not exceed 500 characters")
  })
});
var categoryValidation = {
  createCategoryValidationSchema
};

// src/module/admin/admin.route.ts
var routes = Router3();
routes.post("/categories", auth("ADMIN"), validationReq_default(categoryValidation.createCategoryValidationSchema), admin_controller_default.category);
routes.get("/categories", admin_controller_default.getAllCategory);
routes.patch("/categories/:id", auth("ADMIN"), admin_controller_default.updateCategory);
routes.get("/dashboard", auth("ADMIN"), admin_controller_default.getAdminDashboard);
routes.get("/users", auth("ADMIN"), admin_controller_default.getAllUsers);
routes.get("/bookings", auth("ADMIN"), admin_controller_default.getAllBookings);
routes.patch("/users/:id", auth("ADMIN"), admin_controller_default.userStatusUpdate);
var adminroutes = routes;

// src/module/bookings/bookings.route.ts
import { Router as Router4 } from "express";

// src/module/bookings/bookings.service.ts
var BookingsService = class {
  async createBookings(payload) {
    const {
      userId,
      technicianId,
      serviceId,
      totalAmount,
      address,
      scheduledDate,
      startTime
    } = payload;
    console.log("payload bookings", payload);
    const results = await prisma.booking.create({
      data: {
        userId,
        technicianId,
        serviceId,
        totalAmount,
        address,
        startTime,
        scheduledDate
      }
    });
    return results;
  }
  async getMyBokingsdb(userId, status8) {
    const whereCondition = {};
    if (status8 && status8 !== "undefined" && status8 !== "ALL") {
      whereCondition.status = { equals: status8 };
    }
    if (!userId) {
      throw new Error("user not login pleace login");
    }
    whereCondition.userId = userId;
    console.log("conditon", whereCondition);
    const results = await prisma.booking.findMany({
      where: whereCondition,
      include: { review: true, service: true, payment: true, technician: {
        include: {
          users: true
        }
      } }
    });
    console.log("bookns", results);
    return results;
  }
  async getsingleBokingsdb(id) {
    const results = await prisma.booking.findUniqueOrThrow({
      where: { id },
      include: {
        payment: true,
        technician: {
          include: {
            users: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        review: true
      }
    });
    return results;
  }
};
var bookings_service_default = new BookingsService();

// src/module/bookings/bookings.controller.ts
import statusCode from "http-status";
var BookingsController = class extends baseController {
  createBookings = this.handle(async (req, res) => {
    const body = req.body;
    const userId = req.user?.id;
    const payload = { ...body, userId };
    const booking = await bookings_service_default.createBookings(payload);
    sendResponse(res, { success: true, message: "bookings is successfully", status: statusCode.CREATED, data: booking });
  });
  getMyBookings = this.handle(async (req, res) => {
    const userId = req.user?.id;
    const { status: status8 } = req.query;
    const mybookings = await bookings_service_default.getMyBokingsdb(userId, status8);
    console.log("my ", mybookings);
    sendResponse(res, {
      success: true,
      message: "all my bookings get is successfully",
      status: statusCode.OK,
      data: mybookings
    });
  });
  getsingleBookings = this.handle(async (req, res) => {
    const id = req.params?.id;
    const bookings = await bookings_service_default.getsingleBokingsdb(id);
    sendResponse(res, { success: true, message: "bookings get is successfully", status: statusCode.OK, data: bookings });
  });
};
var bookings_controller_default = new BookingsController();

// src/module/bookings/bookings.validation.ts
import { z as z4 } from "zod";
var createBookingValidationSchema = z4.object({
  body: z4.object({
    technicianId: z4.string().uuid("Technician ID must be a valid UUID"),
    serviceId: z4.string().uuid("Service ID must be a valid UUID"),
    scheduledDate: z4.string().date("Scheduled date must be a valid date"),
    startTime: z4.string().regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Start time must be in HH:mm format"
    ),
    address: z4.string().trim().min(1, "Address is required").min(5, "Address must be at least 5 characters").max(255, "Address must not exceed 255 characters"),
    totalAmount: z4.number({
      error: "Total amount must be a number"
    }).min(1, "totalAmount is required").positive("Total amount must be greater than 0")
  })
});
var bookingValidation = {
  createBookingValidationSchema
};

// src/module/bookings/bookings.route.ts
var router3 = Router4();
router3.post(
  "/",
  validationReq_default(bookingValidation.createBookingValidationSchema),
  auth("CUSTOMER"),
  bookings_controller_default.createBookings
);
router3.get("/", auth("CUSTOMER"), bookings_controller_default.getMyBookings);
router3.get("/:id", bookings_controller_default.getsingleBookings);
var bookingsrouter = router3;

// src/module/service/service.route.ts
import { Router as Router5 } from "express";

// src/module/service/service.service.ts
var ServicesService = class {
  async createServicedb(payload, userId) {
    const { title, description, price, priceType } = payload;
    const technicianProfileExits = await prisma.technicianProfile.findUnique({
      where: { userId }
    });
    if (!technicianProfileExits) {
      throw new Error(
        "tecnician profile is not found! pleace techchian profile updated"
      );
    }
    const technicianId = String(technicianProfileExits.id);
    const categoryId = String(payload.categoryId);
    const results = await prisma.service.create({
      data: {
        title,
        technicianId,
        categoryId,
        description,
        price,
        priceType,
        userId
      }
    });
    console.log("service results", results);
    return results;
  }
  async updateServicedb(payload, userId) {
    const { title, description, price, priceType, serviceId } = payload;
    const technicianProfileExits = await prisma.technicianProfile.findUnique({
      where: { userId }
    });
    if (!technicianProfileExits) {
      throw new Error(
        "tecnician profile is not found! pleace techchian profile updated"
      );
    }
    const technicianId = String(technicianProfileExits.id);
    const categoryId = String(payload.categoryId);
    const results = await prisma.service.update({
      where: { id: serviceId },
      data: {
        title,
        technicianId,
        categoryId,
        description,
        price,
        priceType,
        userId
      }
    });
    console.log("service results", results);
    return results;
  }
  async getAllServices(query) {
    const {
      category,
      location,
      rating,
      price,
      search,
      page
    } = query;
    const whereQuery = {};
    const normalization = search?.trim() ?? "";
    const normalizationCategory = category?.trim() ?? "";
    const normalizationLocation = location?.trim() ?? "";
    const normalizationRating = rating ? Number(rating) : void 0;
    const normalizationPrice = price ? Number(price) : void 0;
    if (normalization) {
      whereQuery.OR = [
        {
          title: {
            contains: normalization,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: normalization,
            mode: "insensitive"
          }
        },
        {
          technician: {
            users: {
              name: {
                contains: normalization,
                mode: "insensitive"
              }
            }
          }
        },
        {
          technician: {
            skills: {
              has: normalization
            }
          }
        }
      ];
    }
    if (normalizationCategory && normalizationCategory !== "All") {
      whereQuery.category = {
        name: {
          contains: normalizationCategory,
          mode: "insensitive"
        }
      };
    }
    if (normalizationLocation && normalizationLocation !== "All") {
      whereQuery.technician = {
        location: {
          contains: normalizationLocation,
          mode: "insensitive"
        }
      };
    }
    if (normalizationPrice !== void 0 && !Number.isNaN(normalizationPrice)) {
      whereQuery.price = {
        gte: normalizationPrice
      };
    }
    if (normalizationRating !== void 0 && !Number.isNaN(normalizationRating)) {
      whereQuery.technician = {
        avgRating: {
          gte: normalizationRating
        }
      };
    }
    const limit = 6;
    const currentPage = Math.max(
      Number(page) || 1,
      1
    );
    const skip = (currentPage - 1) * limit;
    const [
      totalserviceCount,
      serviceInfo,
      availableLocations
    ] = await Promise.all([
      prisma.service.count({
        where: whereQuery
      }),
      prisma.service.findMany({
        where: whereQuery,
        include: {
          technician: true,
          category: true
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.technicianProfile.findMany({
        select: {
          location: true
        },
        distinct: ["location"]
      })
    ]);
    const totalpage = Math.ceil(
      totalserviceCount / limit
    );
    return {
      totalpage,
      serviceInfo,
      locations: availableLocations
    };
  }
  async getsingleServicedb(id) {
    const results = await prisma.service.findUniqueOrThrow({
      where: { id },
      include: {
        technician: {
          include: {
            users: true,
            availabilities: true
          }
        }
      }
    });
    return results;
  }
};
var service_service_default = new ServicesService();

// src/module/service/service.controller.ts
import status6 from "http-status";
var ServiceController = class extends baseController {
  createService = this.handle(async (req, res) => {
    const payload = req.body;
    const userId = req.user?.id;
    const service = await service_service_default.createServicedb(payload, userId);
    sendResponse(res, {
      message: "Service created successfully",
      status: status6.CREATED,
      success: true,
      data: service
    });
  });
  updateService = this.handle(async (req, res) => {
    const body = req.body;
    const userId = req.user?.id;
    const id = String(req.params.id);
    const payload = { ...body, serviceId: id };
    const service = await service_service_default.updateServicedb(payload, userId);
    sendResponse(res, {
      message: "Service Updated successfully",
      status: status6.CREATED,
      success: true,
      data: service
    });
  });
  getService = this.handle(async (req, res) => {
    const query = req?.query;
    const service = await service_service_default.getAllServices(query);
    sendResponse(res, {
      message: "get all service successfully",
      status: status6.OK,
      success: true,
      data: service
    });
  });
  getsingleServices = this.handle(async (req, res) => {
    const id = req.params?.id;
    const service = await service_service_default.getsingleServicedb(id);
    sendResponse(res, {
      success: true,
      message: "Service get is successfully",
      status: status6.CREATED,
      data: service
    });
  });
};
var service_controller_default = new ServiceController();

// src/module/service/service.validation.ts
import { z as z5 } from "zod";
var createServiceValidationSchema = z5.object({
  body: z5.object({
    categoryId: z5.string().uuid("Category ID must be a valid UUID"),
    title: z5.string().trim().min(1, "Title is required").min(3, "Title must be at least 3 characters").max(100, "Title must not exceed 100 characters"),
    description: z5.string().trim().min(1, "Description is required").min(10, "Description must be at least 10 characters").max(1e3, "Description must not exceed 1000 characters"),
    price: z5.number({
      message: "Price must be a number"
    }).positive("Price must be greater than 0"),
    //  price type
    priceType: z5.string().trim().min(1, "Price type is required")
  })
});
var serviceValidation = {
  createServiceValidationSchema
};

// src/module/service/service.route.ts
var router4 = Router5();
router4.post(
  "/services",
  validationReq_default(serviceValidation.createServiceValidationSchema),
  auth("TECHNICIAN"),
  service_controller_default.createService
);
router4.get("/services", service_controller_default.getService);
router4.get("/categories", admin_controller_default.getAllCategory);
router4.get("/services/:id", service_controller_default.getsingleServices);
router4.patch("/update-service/:id", validationReq_default(serviceValidation.createServiceValidationSchema), auth("TECHNICIAN"), service_controller_default.updateService);
var serviceRouter = router4;

// src/module/review/review.route.ts
import { Router as Router6 } from "express";

// src/module/review/review.service.ts
var ReviewService = class {
  // Created Review
  async createReviewDB(payload, role) {
    const { bookingId, technicianId, comment, userId, rating } = payload;
    console.log("review", payload);
    const bookingExists = await prisma.booking.findUnique({
      where: {
        id: bookingId
      }
    });
    if (!bookingExists) {
      throw new Error("This booking does not exist");
    }
    if (bookingExists.status !== BookingStatus.COMPLETED) {
      throw new Error("This booking is not completed!");
    }
    const result = await prisma.review.create({
      data: {
        rating,
        comment,
        bookingId,
        userId,
        technicianId: technicianId || bookingExists.technicianId
      }
    });
    const ratingResult = await prisma.review.aggregate({
      where: {
        technicianId: bookingExists.technicianId
      },
      _avg: {
        rating: true
      }
    });
    await prisma.technicianProfile.update({
      where: {
        id: bookingExists.technicianId
      },
      data: {
        avgRating: Number(ratingResult._avg.rating?.toFixed(1)) ?? 0
      }
    });
    return result;
  }
  async getMyReviewDB(id) {
    const result = await prisma.review.findMany({ where: { userId: id } });
    return result;
  }
};
var review_service_default = new ReviewService();

// src/module/review/review.controller.ts
import status7 from "http-status";
var ReviewController = class extends baseController {
  // create review
  reviewCreate = this.handle(async (req, res) => {
    const user = req.user;
    if (!user) {
      return sendResponse(res, {
        success: false,
        status: status7.UNAUTHORIZED,
        message: "Unauthorized user"
      });
    }
    const { id: userId, role } = user;
    const body = req.body;
    const payload = { ...body, userId };
    console.log("contoller", payload);
    const result = await review_service_default.createReviewDB(payload, role);
    sendResponse(res, {
      success: true,
      status: status7.OK,
      message: "Review created successfully",
      data: result
    });
  });
  getMyreview = this.handle(async (req, res) => {
    const id = req.user?.id;
    const result = await review_service_default.getMyReviewDB(id);
    sendResponse(res, {
      success: true,
      status: status7.OK,
      message: "Review found successfully",
      data: result
    });
  });
};
var review_controller_default = new ReviewController();

// src/module/review/review.validation.ts
import { z as z6 } from "zod";
var createReviewValidationSchema = z6.object({
  body: z6.object({
    bookingId: z6.string().uuid("Booking ID must be a valid UUID"),
    rating: z6.number({
      message: "Rating must be a number"
    }).min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
    comment: z6.string().trim().min(1, "Comment is required").min(10, "Comment must be at least 10 characters").max(1e3, "Comment must not exceed 1000 characters")
  })
});
var reviewValidation = {
  createReviewValidationSchema
};

// src/module/review/review.route.ts
var router5 = Router6();
router5.post(
  "/",
  validationReq_default(reviewValidation.createReviewValidationSchema),
  auth("CUSTOMER"),
  review_controller_default.reviewCreate
);
router5.get("/", auth("CUSTOMER"), review_controller_default.getMyreview);
var reviewRouter = router5;

// src/module/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_Key);

// src/module/payment/payment.service.ts
var PaymentService = class {
  // create payment 
  async paymentCreateDB(bookingId, user) {
    console.log("bookingsId", bookingId);
    const booking = await prisma.booking.findUniqueOrThrow({
      where: {
        id: bookingId
      }
    });
    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can make payment");
    }
    if (booking.status !== "ACCEPTED") {
      throw new Error(
        "Payment is only available for accepted bookings"
      );
    }
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "FixItNow Service Booking"
            },
            unit_amount: Math.round(booking.totalAmount * 120)
          },
          quantity: 1
        }
      ],
      customer_email: user.email,
      metadata: {
        bookingId: booking.id,
        customerId: user.id
      },
      success_url: `${config_default.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config_default.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`
    });
    const payment = await prisma.payment.upsert({
      where: {
        bookingId: booking.id
      },
      update: {
        transactionId: session.id,
        status: "PENDING"
      },
      create: {
        transactionId: session.id,
        bookingId: booking.id,
        customerId: user.id,
        amount: booking.totalAmount,
        method: "Strip",
        status: "PENDING"
      }
    });
    return {
      sessionId: session.id,
      paymentUrl: session.url
    };
  }
  async confrimpaymentDB(sessionId) {
    console.log("session", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new Error("Checkout session not found");
    }
    const exitingPayment = await prisma.payment.findUnique({
      where: { transactionId: session.id }
    });
    if (session.payment_status !== "paid") {
      if (exitingPayment?.status === PaymentStatus.CANCELLED) {
        return exitingPayment;
      }
      const payment2 = await prisma.payment.update({
        where: {
          transactionId: session.id
        },
        data: {
          status: PaymentStatus.CANCELLED,
          paidAt: /* @__PURE__ */ new Date()
        }
      });
      return payment2;
    }
    const payment = await prisma.payment.update({
      where: {
        transactionId: session.id
      },
      data: {
        status: PaymentStatus.PAID,
        paidAt: /* @__PURE__ */ new Date()
      }
    });
    return payment;
  }
  async userPaymentGetDB(id) {
    if (!id) {
      throw new Error("Please login to view payment history");
    }
    const userPaymentDetails = prisma.payment.findMany({
      where: {
        customerId: id
      },
      include: {
        booking: {
          select: {
            service: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const totalPaidUser = prisma.payment.count({
      where: { customerId: id, status: PaymentStatus.PAID }
    });
    const totalPendingUser = prisma.payment.count({
      where: { customerId: id, status: PaymentStatus.PENDING }
    });
    const totalPayment = prisma.payment.aggregate({ where: { customerId: id }, _sum: {
      amount: true
    } });
    const [paidCount, pendingCount, payments, totalPaid] = await Promise.all([
      totalPaidUser,
      totalPendingUser,
      userPaymentDetails,
      totalPayment
    ]);
    return {
      paidCount,
      pendingCount,
      payments,
      totalPaid: totalPaid._sum.amount
    };
  }
  async singlePaymentHistoryDB(id) {
    const result = await prisma.payment.findFirstOrThrow({ where: { id }, include: {
      booking: true
    } });
    return result;
  }
};
var payment_service_default = new PaymentService();

// src/module/payment/payment.controller.ts
import https from "http-status";
var PaymentController = class extends baseController {
  paymentCreate = this.handle(async (req, res) => {
    const { bookingId } = req.body;
    console.log("bookingsId", bookingId);
    const user = req.user;
    const results = await payment_service_default.paymentCreateDB(bookingId, user);
    sendResponse(res, {
      success: true,
      status: https.OK,
      message: "checkout session created successfull",
      data: results
    });
  });
  confrimPayment = this.handle(async (req, res) => {
    const sessionId = req.body.sessionId;
    const result = await payment_service_default.confrimpaymentDB(sessionId);
    sendResponse(res, {
      success: true,
      status: https.OK,
      message: result?.status === PaymentStatus.PAID ? "Payment confirmed successfully" : "Payment Cancel successfully",
      data: result
    });
  });
  userPaymentGet = this.handle(async (req, res) => {
    const id = req.user?.id;
    const result = await payment_service_default.userPaymentGetDB(id);
    sendResponse(res, {
      success: true,
      status: https.OK,
      message: "Payment found",
      data: result
    });
  });
  singlePaymentHistory = this.handle(async (req, res) => {
    const id = req.params.id;
    const result = await payment_service_default.singlePaymentHistoryDB(id);
    sendResponse(res, {
      success: true,
      status: https.OK,
      message: "Payment found",
      data: result
    });
  });
};
var payment_controller_default = new PaymentController();

// src/module/payment/payment.route.ts
var router6 = Router7();
router6.post("/create", auth("CUSTOMER"), payment_controller_default.paymentCreate);
router6.post("/confirm", auth("CUSTOMER"), payment_controller_default.confrimPayment);
router6.get("/", auth("CUSTOMER"), payment_controller_default.userPaymentGet);
router6.get("/:id", payment_controller_default.singlePaymentHistory);
var paymentrouter = router6;

// src/module/customer/customer.route.ts
import { Router as Router8 } from "express";

// src/module/customer/customer.service.ts
var CustomerService = class {
  async getCustomerDashboardDB(userId) {
    const [
      totalBookingCount,
      activeBookingCount,
      totalCompletedCount,
      paymentPaid,
      bookingInfo,
      pendingAmount,
      cancelledPayment,
      review
    ] = await Promise.all([
      //  total Booking Count
      prisma.booking.count({ where: {
        userId
      } }),
      // active Booking Count
      prisma.booking.count({ where: {
        userId,
        status: {
          in: [
            BookingStatus.REQUESTED,
            BookingStatus.ACCEPTED,
            BookingStatus.IN_PROGRESS
          ]
        }
      } }),
      prisma.booking.count({ where: {
        userId,
        status: BookingStatus.COMPLETED
      } }),
      prisma.payment.aggregate({
        where: {
          customerId: userId,
          status: PaymentStatus.PAID
        },
        _sum: {
          amount: true
        },
        _count: true
      }),
      prisma.booking.findMany({
        where: {
          userId
        },
        include: {
          service: {
            select: {
              title: true
            }
          },
          technician: {
            select: {
              skills: true,
              users: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 3
      }),
      prisma.payment.aggregate({
        where: { customerId: userId, status: PaymentStatus.PENDING },
        _sum: {
          amount: true
        },
        _count: true
      }),
      prisma.payment.aggregate({
        where: { customerId: userId, status: PaymentStatus.CANCELLED },
        _sum: {
          amount: true
        },
        _count: true
      }),
      prisma.review.findMany({
        where: {
          userId
        },
        include: {
          customer: true,
          technician: {
            include: {
              users: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 2
      })
    ]);
    return {
      totalBookingCount,
      activeBookingCount,
      paymentPaid,
      totalCompletedCount,
      bookingInfo,
      pendingAmount,
      cancelledPayment,
      review
    };
  }
};
var customer_service_default = new CustomerService();

// src/module/customer/customer.controller.ts
import statusCode2 from "http-status";
var CustomerController = class extends baseController {
  getCustomerDashboard = this.handle(async (req, res) => {
    const userId = req.user?.id;
    const result = await customer_service_default.getCustomerDashboardDB(userId);
    sendResponse(res, { success: true, message: "dashboard data found", status: statusCode2.CREATED, data: result });
  });
};
var customer_controller_default = new CustomerController();

// src/module/customer/customer.route.ts
var router7 = Router8();
router7.get("/dashboard", auth("CUSTOMER"), customer_controller_default.getCustomerDashboard);
var customerRouter = router7;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: config_default.appurl,
  credentials: true
}));
app.get("/", (req, res) => {
  res.send("Fixit prisma project");
});
app.use("/api/auth", authRouter);
app.use("/api/technician", technicianRouter);
app.use("/api", serviceRouter);
app.use("/api/admin", adminroutes);
app.use("/api/bookings", bookingsrouter);
app.use("/api/payments", paymentrouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/customer/", customerRouter);
var app_default = app;

// src/server.ts
var port = config_default.port;
async function main() {
  try {
    await prisma.$connect();
    console.log("database is connect posgresql");
    app_default.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log("Error starting the server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.mjs.map