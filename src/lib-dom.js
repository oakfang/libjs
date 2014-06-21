/**
 * Created by oakfang on 6/21/14.
 */
/* global lib */

lib.module('element', function ($globals) {
    var Element = function (htmlElement) {
        this._element = htmlElement;
    };

    Element.prototype.addClass = function (cls) {
        this._element.classList.add(cls);
        return this;
    };

    Element.prototype.removeClass = function (cls) {
        this._element.classList.add(cls);
        return this;
    };

    Element.prototype.toggleClass = function (cls, condition) {
        if ((typeof condition !== 'undefined' && condition) || !this._element.classList.contains(cls)) {
            this.addClass(cls);
        } else {
            this.removeClass(cls);
        }
        return this;
    };

    Element.prototype.css = function (rule, value) {
        if (typeof value === 'undefined') {
            return $globals.getComputedStyle(this._element)[rule];
        } else {
            this._element.style[rule] = value;
        }
        return this;
    };

    Element.prototype.text = function (value) {
        if (typeof value === 'undefined') {
            return this._element.innerText;
        } else {
            this._element.innerText = value;
        }
        return this;
    };

    Element.prototype.html = function (value) {
        if (typeof value === 'undefined') {
            return this._element.innerHTML;
        } else {
            this._element.innerHTML = value;
        }
        return this;
    };

    return {Element: Element};
});


lib.module('select', function ($globals, element) {
    var Selection = function (selector) {
        this._selector = selector;
        this._selection = $globals.document.querySelectorAll(selector);
    };

    Selection.prototype.refresh = function () {
        this._selection = $globals.document.querySelectorAll(this._selector);
    };

    Selection.prototype.forEach = function (callback) {
        Array.prototype.forEach.call(this._selection, function (el) {callback(new element.Element(el));});
    };

    Selection.prototype.apply = function () {
        if (!arguments.length) {
            throw 'No method name to apply';
        }
        var self = this,
            methodName = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            value = null;
        self.forEach(function (element) {
            if (typeof element[methodName] === 'undefined') {return;}
            value = element[methodName].apply(element, args);
        });

        return typeof value._element === 'undefined' ? value : self;
    };

    return {select: function (selector) {return new Selection(selector);}};
});