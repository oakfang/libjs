/* global window */
(function (globals) {
    'use strict';

    function reflect (func) {
        var args = func.toString().match (/^\s*function\s+(?:\w*\s*)?\((.*?)\)/);
        args = args ? (args[1] ? args[1].trim().split(/\s*,\s*/).map(function (arg) {return arg.replace(/\/\*\s*(\S+)\s*\*\/\s*\w+/, '$1');}) : []) : null;
        return {name: func.name,
            args: args};
    }

    function getGlobals () {
        var items = [];
        for (var key in globals) {
            if (globals.hasOwnProperty(key)) {
                items.push(key);
            }
        }
        return items;
    }

    var Lib = function () {
            this._path = '.';
            this._path = this._path.match(/\/$/) ? this._path : this._path + '/';
            this._loaded = {};
            this._modules = {};
        },
        globalLib = new Lib();

    Lib.prototype.setPath = function (path) {
        this._path = path;
        return this;
    };

    Lib.prototype.getPath = function () {
        return this._path;
    };

    Lib.prototype._importModule = function (module, callback) {
        var self = this,
            requires = reflect(module).args,
            loaded = {},
            onImport = function (index) {
                return function (mod) {
                    var args = [],
                        loadedModule;
                    loaded[index] = mod;
                    for (var j = 0; j < requires.length; j++) {
                        if (typeof loaded[j] !== 'undefined') {args.push(loaded[j]);}
                        else {return;}
                    }
                    loadedModule = module.apply(null, args);
                    if (callback) {callback(loadedModule);}
                };
            };
        if (requires.length === 0) {
            var loadedModule = module();
            if (callback) {callback(loadedModule);}
        }
        for (var i = 0; i < requires.length; i++) {
            self.import(requires[i], onImport(i));
        }
    };

    Lib.prototype._importScript = function (scriptName, callback) {
        var script = globals.document.createElement('script'),
            origGlobals = getGlobals();
        script.src = this._path + scriptName + '.js';
        script.onload = function () {
            var moduleScope = {};
            getGlobals().forEach(function (key) {
                if (origGlobals.indexOf(key) === -1) {
                    console.log(key);
                    moduleScope[key] = globals[key];
                    globals[key] = undefined;
                }
            });
            if (callback) {callback(moduleScope);}
        };
        globals.document.head.appendChild(script);
    };

    Lib.prototype.import = function (moduleName, callback) {
        var self = this;
        if (moduleName === '$globals') {callback(globals);}
        // Module is already loaded
        else if (self._loaded[moduleName] && callback) {callback(self._loaded[moduleName]);}
        // Module is registered to Lib, import normally
        else if (self._modules[moduleName]) {
            self._importModule(self._modules[moduleName], function (loaded) {
                self._loaded[moduleName] = loaded;
                if (callback) {callback(loaded);}
            });
        }
        // Module is not registered, try to source it. This needs a callback.
        else {
            self._importScript(moduleName, function (loaded) {
                self._loaded[moduleName] = loaded;
                if (callback) {callback(loaded);}
            });
        }
    };

    Lib.prototype.registerModule = function (moduleName, module) {
        this._modules[moduleName] = module;
        return this;
    };

    Lib.prototype.run = function (main) {
        this._importModule(main);
        return this;
    };

    globals.lib = {
        module : function (moduleName, moduleFunc) {globalLib.registerModule(moduleName, moduleFunc);},
        main : function (mainRoutine) {globalLib.run(mainRoutine);},
        import: function (moduleName, callback) {globalLib.import(moduleName, callback);},
        modulePath : function (path) {if (path) {globalLib.setPath(path);} else {return globalLib.getPath();}},
        Lib : Lib
    };
}(window));