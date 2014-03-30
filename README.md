project-homeless-connect
========================

PHC Volunteer App


## Setup
    $ git clone https://github.com/john-brock/project-homeless-connect.git
    $ cd project-homeless-connect
    $ npm install
    $ grunt

### Browser

Run the local node server:

    $ node app.js


Open `localhost:5000` in [Chrome Canary](https://www.google.com/intl/en/chrome/browser/canary.html) with flags to allow cross domain origin calls:

    $ open -a /Applications/Google\ Chrome\ Canary.app --args --allow-file-access-from-files --disable-web-security

Whenever a source file changes Canary reloads automatically.

## Develop

### JavaScript

`src/javascript/controller/appController.js`.

### Directives

For a custom directive please see the example `src/javascript/directive/myComp.js` declared in `src/javascript/main.js` with a template in `src/html/myComp.html`.

### HTML

Edit `src/index.html` and be aware to never change the `www/index.html` since it is being overwritten anytime the src file changes.

### CSS

Edit `src/sass/styles.scss`.
