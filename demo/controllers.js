/**
 * Created by oakfang on 6/21/14.
 */

lib.module('MyTitle1', function (select) {
    var $ = select.select;
    $('h1').apply('text', 'This is an Awesome title!');
});

lib.module('MyTitle2', function (select) {
    var $ = select.select;
    $('h1').apply('text', 'This is another title!');
});