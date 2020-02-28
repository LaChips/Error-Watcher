# Meteor Error Watcher

Error Watcher allows you to call a server method when a blaze error occurs. It's been made do allow automatic error reporting.

## Features

 - Automatic error reporting
 - Bert alert on client side to notify the user

## Installation

```bash
meteor add lachips:error-watcher
```

## Usage

Error Watcher only needs a server method to work. For now, this methods have to be named logWatchError.

```bash
	logWatchError(data) {
		console.log("error : ", data);
		return {msg: "client bert alert message"};
	}
```

The ```data``` parameter contains some information about the error :

|key|type|description|
|---|----|-----------|
|text|string|the error message (as a string)|
|date|timestamp|the date (as a timestamp)|
|function|string|the function causing the error|
|template|string|the template in which the error happened|
|trace|Array|the complete trace of the error|  
</br>

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)