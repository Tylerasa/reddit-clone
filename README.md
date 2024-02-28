
# Reddit Clone

## Overview

This implementation is a 1:1 representation of the design in Figma.

It utilizes the stack from `create-t3-app` and incorporates the following additional packages:

- Clerk: for user management
- Shadcn: for reusable frontend components, including:
  - Accordion: to collapse and expand replies under comments
  - Sonner: for toast notifications
  - Skeleton: for rendering skeleton layouts while fetching data
  - Form, Input, Button, Label: for form management

## How it works

Users can view posts from everyone but must be logged in to upvote/downvote or comment.

## How to get started

There are two options to get started:

1. Use the live demo by clicking [this link](https://reddit-clone-mu-eight.vercel.app/).
2. Self-host the application.

### Self-Hosting

1. Rename `.env.example` to `.env`.

#### Requirements

- Create an account and application with Clerk, selecting Google as the only option. Once done, obtain your `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and replace `<CLERK_SECRET_KEY_HERE>` and `<NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_HERE>` respectively with their corresponding values.
- Next, create a database from PlanetScale and replace `<DATABASE_URL_HERE>` with the database URL you obtained from PlanetScale.

#### Setup

1. After setting up Clerk and the database, install all necessary dependencies and packages by running:
   ```
   npm install
   ```
2. Push the schema to your database by running:
   ```
   npx prisma db push
   ```

#### Running the Application

You should now be able to use the application by running:
```
npm run dev
