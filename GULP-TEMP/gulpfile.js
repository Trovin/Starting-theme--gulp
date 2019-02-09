'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/styles/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/app.min.js',
        style: 'src/styles/scss/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/scss/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Trovin"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src([
        './node_modules/jquery/dist/jquery.min.js',
        './src/js/main.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.js));   
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        //build scss
        .pipe(sass({
            errLogToConsole: true
        }))
        //build css
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        })) 
        .pipe(concat('style.min.css'))
        .pipe(cssmin())     
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css))   
        .pipe(reload({stream: true}));     
});


gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
});


gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], {readDelay: 200}, function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);