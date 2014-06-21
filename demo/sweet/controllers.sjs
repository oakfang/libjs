module MyTitle1 requires (select) {
    defines {
        subas select.select, $;
        $('h1').apply('text', 'This is an Awesome title!');
    }
}

module MyTitle2 requires (select) {
    defines {
        subas select.select, $;
        $('h1').apply('text', 'This is another title!');
    }
}