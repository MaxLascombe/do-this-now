# Do This Now Mobile

A React Native mobile version of the Do This Now task management application.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Configure AWS Amplify:

   - Copy your `aws-exports.js` file from the web version to the root of this
     project
   - Make sure to rename it to `aws-exports.ts`

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
   - Press `i` to run on iOS simulator
   - Press `a` to run on Android emulator
   - Scan the QR code with Expo Go app on your physical device

## Features

- Task management with priority sorting
- Task completion and snoozing
- Subtask support
- Task history
- Dark mode UI
- AWS Amplify backend integration

## Development

The app is built with:

- React Native
- Expo
- TypeScript
- React Navigation
- Redux for state management
- React Query for data fetching
- AWS Amplify for backend services

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── screens/        # Screen components
  ├── hooks/          # Custom React hooks
  ├── store/          # Redux store configuration
  ├── shared-logic/   # Shared business logic
  └── helpers/        # Utility functions
```
