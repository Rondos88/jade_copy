"use strict";

/* параметры для gulp-autoprefixer */
var autoprefixerList = [
    'Chrome >= 45',
    'Firefox ESR',
    'Edge >= 12',
    'Explorer >= 10',
    'iOS >= 9',
    'Safari >= 8',
    'Android >= 4.4',
    'Opera >= 30'
];
/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    build: {
        html: 'assets/build/',
        jsmain: 'assets/build/js/',
        js: 'assets/build/js/',
        css: 'assets/build/css/',
        img: 'assets/build/img/',
        fonts: 'assets/build/fonts/',
        libs: 'assets/build/libs/',
        fav: 'assets/build/favicons/'
    },
    src: {
        html: 'assets/src/*.html',
        jade: 'assets/src/jade/*.jade',
        src: 'assets/src/',
        jsmain: 'assets/src/js/main.js',
        js: 'assets/src/js/**/*.js',
        style: 'assets/src/sass/main.scss',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/src/fonts/**/*.*',
        fav: 'assets/src/favicons/*.*',
        libs: 'assets/src/libs/**/*.*',
        sprite: 'assets/src/img/sprite/**/*.png'
    },
    watch: {
        html: 'assets/src/**/*.html',
        jade: 'assets/src/jade/**/*.jade',
        js: 'assets/src/js/**/*.js',
        css: 'assets/src/sass/**/*.scss',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*',
        libs: 'assets/src/libs/**/*.*'
    },
    clean: './assets/build'
};
/* настройки сервера */
var config = {
    server: {
        baseDir: './assets/build'
    },
    notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'), // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    bourbon = require('node-bourbon'), //Библиотека миксинов для SASS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    spritesmith = require('gulp.spritesmith'), //для создания спрайтов
    del = require('del'), // плагин для удаления файлов и каталогов
    jade = require('gulp-jade'); //HTML шаблонизатор


/* задачи */



// запуск сервера
gulp.task('webserver', function() {
    webserver(config);
});


// jade компиляция
gulp.task('jade:build', function () {
    return gulp.src(path.src.jade)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.src.src))
});


// сбор html
gulp.task('html:build', function() {
    gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});

// сбор стилей
gulp.task('css:build', function() {
    gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass({
            includePaths: bourbon.includePaths, //подключаем bourbon
            outputStyle: 'expanded',
        })) // scss -> css
        .pipe(autoprefixer({ // добавим префиксы
            browsers: autoprefixerList
        }))
        //.pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// сбор js
gulp.task('jsmain:build', function() {
    gulp.src(path.src.jsmain) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(uglify()) // минимизируем js
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.jsmain)) // положим готовый файл
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

gulp.task('js:build', function() {
    gulp.src([path.src.js, '!assets/src/js/main.js'])
        .pipe(gulp.dest(path.build.js)); // Переносим скрипты в продакшен
});

gulp.task('libs:build', function() {
    gulp.src(path.src.libs).pipe(gulp.dest(path.build.libs)); // Переносим Библиотеки Скриптов в продакшен
});

gulp.task('fav:build', function() {
    gulp.src(path.src.fav).pipe(gulp.dest(path.build.fav)); // Переносим favicons в продакшен
});

// перенос шрифтов
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('sprite', function() {
    var spriteData = gulp.src(path.src.sprite)
        .pipe(plumber())
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../img/sprite.png',
            cssName: '_sprite.scss',
            cssPath: '/sass/',
            algorithm: 'binary-tree',
            padding: 5
        }))
    var imgStream = spriteData.img
        .pipe(gulp.dest('assets/src/img/'))

    var cssStream = spriteData.css
        .pipe(gulp.dest('assets/src/sass/'))
});

// обработка картинок
gulp.task('image:build', function() {
    gulp.src(path.src.img) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
});


// удаление каталога build 
gulp.task('clean:build', function() {
    del.sync(path.clean);
});

// очистка кэша
gulp.task('cache:clear', function() {
    cache.clearAll();
});

// сборка
gulp.task('build', [
    'clean:build',
    'jade:build',
    'html:build',
    'css:build',
    'js:build',
    'jsmain:build',
    'libs:build',
    'fonts:build',
    'image:build',
    'fav:build'
]);

// запуск задач при изменении файлов
gulp.task('watch', function() {
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.jade, ['jade:build']);
    gulp.watch(path.watch.css, ['css:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['image:build']);
    gulp.watch(path.watch.fonts, ['fonts:build']);
    gulp.watch(path.watch.fonts, ['jsmain:build']);
    gulp.watch(path.watch.fonts, ['libs:build']);
});

// задача по умолчанию
gulp.task('default', [
    'clean:build',
    'build',
    'webserver',
    'watch'
]);