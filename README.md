# Meteor Error Watcher

Error Watcher allows you to call a server method when a blaze error occurs. It's been made to allow automatic error reporting.

## Features

 - Automatic error reporting
 - Bert alert with customizable message on client side to notify the user

## Installation

```bash
meteor add lachips:error-watcher
```

## Usage

Import ErrorWatcher in your main.js :
```javascript
import { ErrorWatcher } from 'meteor/lachips:error-watcher';
```

By default, Error-watcher only performs a console.log of the error on the server. To change the default server method and the default client behavior, simply add the following in your server main.js.

```javascript
ErrorWatcher.showClientAlert = false; //If set to false, alert won't be displayed
ErrorWatcher.msg = "your message"; //The message included in the alert. Alerts won't show up if you leave it empty (default).
ErrorWatcher.position = "alert position"; //fixed-top (default) | fixed-bottom | growl-top-left | growl-top-right | growl-bottom-left | growl-bottom-right;
ErrorWatcher.icon = "alert icon"; // You must provide Font Awesome yourself, leave it blank it you don't.
ErrorWatcher.func = function(error) {
	//do your things
}
```

The ```error``` parameter contains some information about the error :

|key|type|description|
|---|----|-----------|
|text|string|the error message (as a string)|
|date|timestamp|the date (as a timestamp)|
|function|string|the function causing the error|
|template|string|the template in which the error happened|
|trace|Array|the complete trace of the error|  
</br>

## What's next ?

 - Add support for events errors
 - Add support for every client errors
 - Add react compatibility

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
