const mix = require('laravel-mix').mix;

mix.setPublicPath(__dirname);

mix.react('src/react/index.jsx', 'src/dist/js/main.js');

mix.sass('src/styles/scss/main.scss', 'src/dist/css/main.css');
mix.options({
  processCssUrls: false,
});

mix.copy('node_modules/bootstrap-sass/assets/fonts/bootstrap', 'src/dist/fonts');
