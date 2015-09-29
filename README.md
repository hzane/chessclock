# Firebase Chess Clock

This is a test project using the Firebase data-sync service and btford's Angular Socket.io Seed.

## Directory Layout
    
    app.js                  --> app config
    bower.json              --> for bower
    package.json            --> for npm
    public/                 --> all of the files to be used in on the client side
      css/                  --> css files
        app.css             --> default stylesheet
      img/                  --> image files
      js/                   --> javascript files
        app.js              --> declare top-level app module
        controllers.js      --> application controllers
        directives.js       --> custom angular directives
        filters.js          --> custom angular filters
        services.js         --> custom angular services
      bower_components/
        angular/            --> angular.js
        angular-socket-io/  --> socket.io adapter for angular
    routes/
      index.js              --> route for serving HTML pages and partials
    views/
      index.jade            --> main page for app
      layout.jade           --> doctype, title, head boilerplate
      partials/             --> angular view partials (partial jade templates)
        game.jade
        home.jade
        join.jade
        new.jade



