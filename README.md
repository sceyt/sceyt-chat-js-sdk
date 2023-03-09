# SceytChat JavaScript SDK

The SceytChat JavaScript SDK provides developers with a powerful and flexible chat interface that can be easily integrated into JavaScript apps. With SceytChat, you can easily add one-to-one and group chat functionality to your app. It comes packed with a wide range of features, including message threading, media and file sharing, reactions, user mentions, message search, user and channel blocking, message forwarding and replies, and many more.

## Table of contents

* [Getting Started](#getting-started)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)

## Getting Started

To get started with this SDK, you will need to have Node.js and npm installed on your machine. You can install them by following the instructions on the [Node.js website](https://nodejs.org/).

Once you have Node.js and npm installed, you can install this SDK by running the following command:


## Installation

1. Add the following line to the `package.json` file for your project and run `npm install`

```scss
"dependencies" {
  "sceyt-chat": "https://github.com/sceyt/sceyt-chat-js-sdk#1.0.0",
}
```


## Usage

1. To use the SceytChat JavaScript SDK, you will need to initialize it with your Sceyt application credentials. The initialization requires the following parameters:

    `apiUrl:` The base URL of the Sceyt chat API.

    `appId:` The ID of your Sceyt chat application.


```javascript
import SceytChatClient from 'sceyt-chat';

const sceytClient = new SceytChatClient('{ApiKey}', '{AppId}', '{clientId}')

sceytClient.connect('{chatToken}')
```

## License

See the [LICENSE](LICENSE.txt) file for details.
