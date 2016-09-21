# poc blockchain ui
This repository contains an example energy trader application that talks to a blockchain backend.

## Get Started
First clone this repo and install the dependencies.

1. Clone the repo.

```
$ git clone git@github.build.ge.com:212400520/poc-blockchain-ui.git && cd poc-blockchain-ui
```

2. Install dependencies

```
$ npm i && bower install
```

3. Start application locally

```
$ npm start
```

> Note: default port is http://localhost:9000

4. Deploy application to Cloud Foundry

```
$ npm run deploy
```


## Usage
The web application demonstrates using the blockchain REST api to invoke and query nodes.

Here are some steps to get you started.

1. Once the server is running open the URL in the browser.
2. The `start/stop clock` button will simulate reporting random data and settling every other second.
3. The `random report` button will report random data for each meter, (+ val is a producer / - val is a consumer).
4. The `settle` button will settle the meters and refresh the meters thus transfering the account_balance from meters.
5. The `refresh` icon button will refresh all meters.

> Note: If values are not updating correctly that is because of the lag on the blockchain code
