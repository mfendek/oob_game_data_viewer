let mix = require('laravel-mix').mix;

mix.setPublicPath(__dirname);

mix.js('src/js/main.js', 'src/js/dist/main.js')
  .autoload({
    jquery: ['$', 'window.jQuery', 'jQuery'],
  });

mix.sass('src/styles/scss/main.scss', 'src/styles/css/main.css');
mix.options({
  processCssUrls: false
});

mix.copy('node_modules/bootstrap-sass/assets/fonts/bootstrap', 'src/styles/fonts');
