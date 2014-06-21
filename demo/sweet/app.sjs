main (libRoute) {
    libRoute
        .route('MyTitle1', {hash: /^#a/})
        .route('MyTitle2', {hash: /^#b/})
        .run();
}