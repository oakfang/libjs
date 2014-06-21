/**
 * Created by oakfang on 6/21/14.
 */
/* global lib */

lib.module('jr', function ($globals) {
    var JSON_CONTENT_TYPE = 'application/json; charset=UTF-8',
        jsonRequest = function (method, url, callback, errorCallback) {
            var xhr = new $globals.XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', JSON_CONTENT_TYPE);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 && typeof callback !== 'undefined') {
                        callback(JSON.parse(xhr.responseText));
                    } else if (xhr.status !== 200 && typeof errorCallback !== 'undefined') {
                        try {
                            errorCallback(JSON.parse(xhr.responseText), xhr.status);
                        } catch (err) {
                            errorCallback(xhr.responseText, xhr.status);
                        }
                    }
                }
            };
            return xhr;
        };
    return {jsonRequest: jsonRequest,
        jsonify: function (obj) {return $globals.JSON.stringify(obj);}};
});

lib.module('requests', function (jr) {
    return {get: function (url, callback, err) {
        jr.jsonRequest('GET', url, callback, err).send(null);
    },
        post: function (url, data, callback, err) {
            jr.jsonRequest('POST', url, callback, err).send(jr.jsonify(data));
        },
        put: function (url, data, callback, err) {
            jr.jsonRequest('PUT', url, callback, err).send(jr.jsonify(data));
        },
        patch: function (url, data, callback, err) {
            jr.jsonRequest('PATCH', url, callback, err).send(jr.jsonify(data));
        },
        delete: function (url, callback, err) {
            jr.jsonRequest('DELETE', url, callback, err).send(null);
        }
    };
});

lib.module('api', function (requests) {
    var API = function (root) {
        this.root = '/' + root;
    };

    API.prototype.get = function (a, b) {
        var query = typeof b === 'undefined' ? b : a,
            onFetch = typeof b === 'undefined' ? a : b;
        if (typeof query === 'object') {
            requests.post(this.root + '/query', query, onFetch);
        } else if (query) {
            requests.get(this.root + '/' + query, onFetch);
        } else {
            requests.get(this.root + '/query', onFetch);
        }
    };

    API.prototype.create = function (resource, onCreate) {
        requests.post(this.root, resource, onCreate);
    };

    API.prototype.replace = function (resourceId, update, onUpdate) {
        requests.put(this.root + '/' + resourceId, update, onUpdate);
    };

    API.prototype.update = function (resourceId, update, onUpdate) {
        requests.patch(this.root + '/' + resourceId, update, onUpdate);
    };

    API.prototype.remove = function (resourceId, onDelete) {
        requests.delete(this.root + '/' + resourceId, onDelete);
    };

    API.prototype.call = function (resourceId, method, onReturn) {
        requests.get(this.root + '/' + resourceId + '/' + method, onReturn);
    };

    return {API: API};
});