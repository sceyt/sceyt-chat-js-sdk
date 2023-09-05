# Sceyt Chat JavaScript SDK

The Sceyt Chat JavaScript SDK is a pure JavaScript library that enables the addition of chat functionalities into your application by interacting with the Sceyt Chat API. It provides developers with a convenient interface that can be easily integrated into any JavaScript app. With Sceyt Chat, you can effortlessly incorporate one-to-one and group chat functionalities into your application. It comes packed with a wide range of features, including message threading, media and file sharing, reactions, user mentions, message search, user and channel blocking, message replies, and many more.

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [License](#license)

## Installation

To use the Sceyt Chat JavaScript SDK in your project, you can install it via `yarn` or `npm`.

### yarn
To install the Sceyt Chat JavaScript SDK using Yarn, run the following command:

```bash
yarn add sceyt-chat
```

### npm
To install the Sceyt Chat JavaScript SDK using npm, run the following command:

```bash
npm i sceyt-chat
```

## Usage

1. To use the Sceyt Chat JavaScript SDK in your application, you'll need to initialize it with the following parameters:

- `apiUrl` - The URL for the Sceyt Chat API endpoint that the SDK should connect to. You can find this value in the [Sceyt Management Console](https://sceyt.com). This parameter is required.
- `appId` - The unique ID of your application. You can find this value in the [Sceyt Management Console](https://sceyt.com). This parameter is required.
- `clientId` - The unique ID for your `SceytChat` client. This parameter should be unique across the instances if you want to use multiple clients of the same user, for example in multiple browser tabs.
- `requestTimeout` - An optional parameter that specifies the maximum amount of time in milliseconds to wait for a response from the Sceyt Chat API before timing out. If this parameter is not specified, the SDK will use a default timeout of 10000 milliseconds (10 seconds).

Make sure to update the placeholders `YOUR_API_URL`, `YOUR_APP_ID`, and `YOUR_CLIENT_ID` with your actual values.

```javascript
import SceytChat from 'sceyt-chat';

const chatClient = new SceytChat('YOUR_API_URL', 'YOUR_APP_ID', 'YOUR_CLIENT_ID');
```

2. Before connecting to the Sceyt Chat API, it is suggested to add a connection listener to the `SceytChat` client to handle various events that may occur during the connection lifecycle.

```javascript
// Create a new connection listener
const connectionListener = new chatClient.ConnectionListener();

// Set the listener function for the 'connectionStatusChanged' event
connectionListener.onConnectionStatusChanged = async (status) => {
  console.log('Connection status changed:', status);
};

// Set the listener function for the 'tokenWillExpire' event
connectionListener.onTokenWillExpire = async (timeInterval) => {
  console.log('Token will expire in', timeInterval/1000, 'seconds');
};

// Set the listener function for the 'tokenExpired' event
connectionListener.onTokenExpired = async () => {
  console.log('Access token has expired');
};

// Add the connection listener to the SceytChat client
chatClient.addConnectionListener('my-connection-listener', connectionListener);
```

3. Now that the listener is added, connect to the Sceyt Chat API with a valid access token.

```javascript
await chatClient.connect('YOUR_ACCESS_TOKEN');
```

4. Once the connection is successfully established, you are ready to create channels and send messages.

```javascript
// Define the channel members
const channelMembers = [
    {
        role: 'participant',
        id: 'alice'
    },
    {
        role: 'participant',
        id: 'john'
    }
];

// Set the channel parameters
const params = {
    type: 'group',
    subject: 'Marketing',
    members: channelMembers
};

// Create a new channel
const channel = await chatClient.Channel.create(params);

// Create a message builder to construct a message object for sending
const messageBuilder = channel.createMessageBuilder();
const messageToSend = messageBuilder
    .setBody('Hey team! How are you doing today?')
    .setType('common')
    .create();

// Send the message
const message = await channel.sendMessage(messageToSend);
```

## License

See the [LICENSE](LICENSE.txt) file for details.
