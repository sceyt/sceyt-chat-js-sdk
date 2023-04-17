# SceytChat JavaScript SDK

The SceytChat JavaScript SDK provides developers with a powerful and flexible chat interface that can be easily integrated into JavaScript apps. With SceytChat, you can easily add one-to-one and group chat functionality to your app. It comes packed with a wide range of features, including message threading, media and file sharing, reactions, user mentions, message search, user and channel blocking, message forwarding and replies, and many more.

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [License](#license)

## Installation

To use the SceytChat JavaScript SDK in your project, you can install it via `npm` or `yarn`.

### npm
To install the SceytChat JavaScript SDK using npm, run the following command:



```bash
npm i sceyt-chat
```

### yarn
To install the SceytChat JavaScript SDK using Yarn, run the following command:

```bash
yarn add sceyt-chat
```

## Usage

To use the SceytChat SDK in your application, you'll need to initialize it with the following parameters:

- `apiUrl:` The URL for the Sceyt Chat API endpoint that the SDK should connect to. You can find this value in the Sceyt managment dashboard. This parameter is required.
- `appId:` The unique ID for your Sceyt Chat application. You can find this value in the Sceyt managment dashboard. This parameter is required.
- `clientId` The unique ID for your SceytChat client. This parameter should be unique across the instances if you want to use multiple clients of the same user, for example in multiple browser tabs.
- `requestTimeout` An optional parameter that specifies the maximum amount of time in milliseconds to wait for a response from the Sceyt Chat API before timing out. If this parameter is not specified, the SDK will use a default timeout of 10000 milliseconds (10 seconds).

```javascript
import SceytChat from 'sceyt-chat';

const sceytClient = new SceytChat('{apiUrl}', '{appId}', '{clientId}')
```

Before connecting to the SceytChat service, it's a good idea to add connection listeners to the SceytChat client to handle various events that may occur during the connection process. Here are connection listeners you can add:

```javascript
// Create a new connection listener
const connectionListener = new sceytClient.ConnectionListener();

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
sceytClient.addConnectionListener('my-connection-listener', connectionListener);
```

Before creating a channel and sending messages, make sure the SceytChat client is connected:

```javascript
// Connect to the Sceyt Chat API with a valid access token
sceytClient.connect('{accessToken}');
```

Now you can create a new channel with different members and send a message:

```javascript
const members = [
    {
        role: 'participant',
        id: 'alice'
    },
    {
        role: 'participant',
        id: 'john'
    }
]

const params = {
    subject: 'Marketing Group',
    members
}

const marketingGroup = await sceytClient.PrivateChannel.create(params);

// Create a message builder to construct a message object for sending
const messageBuilder = marketingGroup.createMessageBuilder();
const messageToSend = messageBuilder
    .setBody('Hey team! How are you doing today?')
    .setType('common')
    .create();

// Send the message
const message = await channel.sendMessage(messageToSend);
```

## License

See the [LICENSE](LICENSE.txt) file for details.
