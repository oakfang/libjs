/**
 * Created by oakfang on 6/21/14.
 */
/* global lib */

lib.module('libRoute', function ($globals) {
    var Router = function () {
        this._ctrls = {};
    }, globalRouter = new Router();

    Router.prototype.route = function (ctrl, urlRule) {
        urlRule = urlRule || {};
        this._ctrls[ctrl] = urlRule;

        return this;
    };

    Router.prototype.run = function () {
        var self = this;
        for (var ctrl in self._ctrls) {
            if (self._ctrls.hasOwnProperty(ctrl)) {
                var urlRule = self._ctrls[ctrl],
                    apply = true;
                for (var subRule in urlRule) {
                    if (urlRule.hasOwnProperty(subRule) && $globals.location.hasOwnProperty(subRule)) {
                        if (!$globals.location[subRule].match(urlRule[subRule])) {
                            apply = false;
                            break;
                        }
                    }
                }
                if (apply) {
                    lib.import(ctrl);
                }
            }
        }
    };

    Router.prototype.listen = function () {
        var self = this;
        $globals.addEventListener('hashchange', function () {self.run();}, false);
    };

    globalRouter.listen();

    return {
            Router: Router,
            route: function(ctrl, urlRule) {return globalRouter.route(ctrl, urlRule);}
    };
});