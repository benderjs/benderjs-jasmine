benderjs-jasmine
============

Adapter for [Jasmine](http://jasmine.github.io) testing framework for [Bender.js](https://github.com/benderjs/benderjs).

Installation
------------

```
npm install benderjs-jasmine
```

Usage
-----

Add `benderjs-jasmine` to the plugins array in the `bender.js` configuration file:

```javascript
var config = {
    applications: {...}
        
    browsers: [...],
    
    plugins: ['benderjs-jasmine'], // load the plugin
        
    tests: {...}
};
    
module.exports = config;
```

Set `jasmine` as a `framework` for entire project or a specific tests group:

```javascript
var config = {
    applications: {...}
        
    browsers: [...],
        
    framework: 'jasmine', // use for entire project
    
    plugins: ['benderjs-jasmine'],
        
    tests: {
        Foo: {
            basePath: '',
            framework: 'jasmine' // or use for a specific tests group
            paths: [...]
        }
    }
};

module.exports = config;
```

TODO
----

- regression handling
- single test execution

License
-------

MIT, for license details see: [LICENSE.md](https://github.com/benderjs/benderjs-jasmine/blob/master/LICENSE.md).
