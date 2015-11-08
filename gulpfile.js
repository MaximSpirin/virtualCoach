/**
 * Created by maxim_000 on 11/6/2015.
 */

'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    //prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass    = require('gulp-sass'),
    //sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/Content/DrillEditor/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        //html: 'src/*.html',
        html: 'index.html',
        js: 'js/drillEditor.js',
        style: 'css/drillEditor.css',
        img: 'img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

// variable that contains settings for our development server
var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

// task for building html
gulp.task('html:build', function(){
    gulp.src(path.src.html) //select files with the desired path
        .pipe(rigger()) //process through rigger
        .pipe(gulp.dest(path.build.html)) //print files to /build
        .pipe(reload({stream:true}));
});

// task for building js
gulp.task('js:build', function(){
    gulp.src(path.src.js) //select js files
        .pipe(rigger()) //process js files through rigger
    //    .pipe(sourcemaps.init()) //initialize sourcemap
        .pipe(uglify()) //compress js
    //    .pipe(sourcemaps.write()) //write maps
        .pipe(gulp.dest(path.build.js)) //write result files
        .pipe(reload({stream:true})); //reload server
});

//task for css
gulp.task('style:build', function(){
    gulp.src(path.src.style)
       // .pipe(sourcemaps.init())
        .pipe(sass())
      //  .pipe(prefixer())
        .pipe(cssmin())
      //  .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream:true}))
});


gulp.task('image:build', function(){
    gulp.src(path.src.img) //select all images
        .pipe(imagemin({
            progressive:true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream:true}));
});