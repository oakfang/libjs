libjs
=====

Making scoping better.

### Welcome to LibJS.
This modular library is here to make sure you do not use code you do not need.

### It's all about the modules
With LibJS, you divide your code into modules, like so:

```
lib.module('spam', function(moduleA, moduleB) {
    var foo = moduleB.thingify('bar' * moduleA.CONST);
    function poof (obj) {
        return typeof obj === 'undefined' ? foo : bar;
    }

    return {poof: poof};
});
```

Each module is registered to a global library of modules (obviously, you might as well create a local Lib, if you so desire).

The module's parameters (i.e. moduleA and moduleB, above) are also modules loaded into the lib. Just make sure they're loaded up.

Then, you simply register your *main*:
```
lib.main(function (spam) {
    // ...
});
```

Make sure to call it after loading all modules.

### But what do I do with all other published libraries I have?
What a great question to have! Lets say you wish to use `jQuery.min.js`. Well, first of all, **don't put it as a script tag**. I know, I told you to make sure everything is loaded before using main. I kind of lied. See, you *can* specify a requirement you haven't loaded, but what this will do is search your `libpath` (which you can change prior to your man declaration thus: `lib.modulePath('/static/js').main(...);`) for `moduleName.js` and insert it dynamically into the dom. It will also harvest all changes to the global scope made by the script and move them into the module's scope.

### But, sir, `jQuery.min` is NOT a legal parameter name!
Right you are. You can use the aliasing syntax for that:
```
lib.module('myModule', function(/* jQuery.min */jquery){...});
```
This will load jQuery.min.js as you jquey parameter. Isn't that just neat?

### I just wish you had some better syntax for it
Well, if you're not above using `sweet.js`, there's some cool features it adds. You should run `libc` from the `compiler` directory (using python2.7) with a single argument that is your directory of .sjs files.

What's so great about the sweet support? Well, this:
```
module spam requires (moduleA, moduleB) {
   defines {
       sub moduleB.thingify;
       subas moduleA.CONST, C;
       var foo = thingify('bar' * C);
       function poof (obj) {
          return typeof obj === 'undefined' ? foo : bar;
       }
   }
   exports {poof: poof}
}
```

### What's in it for me?
Well, not much, yet. Currently, there are a few cool modules that ship with `lib.js` (which you don't have you use, obviously). You can look at the demo page, and see, for example, the uses of `lib-route` and it's `libRoute` module. More features (especially regarding `lib-dom`) are under active development.
