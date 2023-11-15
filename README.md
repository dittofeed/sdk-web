# @dittofeed/sdk-web

Dittofeed web SDK, used to send events to Dittofeed from the browser. Dittofeed is an open source customer engagement platform.

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

### Install the Snippet

You can also import the Dittofeed snippet into your web app. This snippet will automatically load the Dittofeed SDK and initialize it with your write key.

This is convenient if you want to use the Dittofeed SDK without a build system e.g. in a site builder like Webflow.

```html
<script type="text/javascript">
  var _df = _df || [];

  (function () {
    var methods = ["track", "identify", "page", "flush"];
    methods.forEach(function (method) {
      _df[method] = function () {
        _df.push([method].concat(Array.prototype.slice.call(arguments)));
      };
    });

    var script = document.createElement("script");
    script.type = "module";
    script.async = true;

    // If you're self-hosting the Dittofeed dashboard, you'll need to to
    // specificy your own host.
    script.src = "https://dittofeed.com/dashboard/public/dittofeed.umd.js";

    script.id = "df-tracker";
    // Replace with your own write key found on: https://dittofeed.com/dashboard/dittofeed.umd.js
    script.setAttribute("data-write-key", "Basic my-write-key");
    // If you're self-hosting dittofeed, you'll need to to specificy your own host.
    // script.setAttribute("data-host", "http://localhost:3001");

    document.head.appendChild(script);
  })();

  _df.identify({
    userId: "123",
    email: "test@email.com"
  });
</script>
```