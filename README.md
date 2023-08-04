# @dittofeed/sdk-web

Dittofeed web SDK, used to send events to Dittofeed from the browser, an open source customer engagement platform.

## Installation

```bash
# Using Yarn
yarn add @dittofeed/sdk-web

# Using NPM
npm install --save @dittofeed/sdk-web
```

## Usage

```typescript
import { DittofeedSdk } from '@dittofeed/sdk-web';

// Initialize the sdk with a writeKey, which is used to identify your
// workspace. This key can be found at
// https://dittofeed.com/dashboard/settings
await DittofeedSdk.init({
  writeKey: "Basic abcdefg...",
});

// Lets you tie a user to their actions and record traits about them. It
// includes a unique User ID and any optional traits you know about the
// user, like their email, name, and more.
DittofeedSdk.identify({
  userId: "123",
  traits: {
    email: "john@email.com",
    firstName: "John"
  },
});

// The track call is how you record any actions your users perform, along
// with any properties that describe the action.
DittofeedSdk.track({
  userId: "123",
  event: "Made Purchase",
  properties: {
    itemId: "abc",
  },
});

// Lets you record whenever a user sees a screen, the mobile equivalent of
// page, in your mobile app, along with any properties about the screen.
DittofeedSdk.screen({
  userId: "123",
  name: "Recipe Screen",
  properties: {
    recipeType: "Soup",
  },
});

// Ensures that asynchronously submitted events are flushed synchronously
// to Dittofeed's API.
await DittofeedSdk.flush();
```