/**
 * Created by oakfang on 6/21/14.
 */

lib.main(function (libRoute) {
    libRoute
        .route('MyTitle1', { hash: /^#a/ })
        .route('MyTitle2', { hash: /^#b/ })
        .run();
});