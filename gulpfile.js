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
    rename = require('gulp-rename'),
    reload = browserSync.reload;


var path = {

    build: {
        html: 'build/minified/',
        js: 'build/minified/js/',
        css: 'build/minified/css/',
        img: 'build/minified/Content/DrillEditor/img/',
        fonts: 'build/minified/fonts/',
        content: 'build/minified/Content/',
        external: 'build/minified/external/'
    },

    build_uncompressed:{
        html: 'build/uncompressed/',
        js:  'build/uncompressed/',
        css: 'build/uncompressed/css/',
        img: 'build/uncompressed/Content/DrillEditor/img',
        content: 'build/uncompressed/Content/',
        external: 'build/uncompressed/external/'
    },

    src: { //Пути откуда брать исходники
        //html: 'src/*.html',
        html: 'index-build.html',
        html_dev: 'index.html',
        js: 'js/drillEditor.js',
        js_uncompressed: [
            './js/controller/**/*.*', "./js/dispatcher/**/*.*",
            "./js/events/**/*.*", "./js/model/**/*.*",
            "./js/snippets/**/*.*", "./js/utils/**/*.*",
            "./js/view/**/*.*", "./js/DrillEditorApplication.js"],
        style: 'css/drillEditor.css',
        img: 'img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        content: 'Content/**/*',
        external: 'external/**/*'
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
        .pipe(rename("index.html"))
        .pipe(gulp.dest(path.build.html)); //print files to /build
});

gulp.task('html:build_uncompressed', function(){
    gulp.src(path.src.html_dev) //select files with the desired path
        .pipe(gulp.dest(path.build_uncompressed.html));
});


// task for building js
gulp.task('js:build', function(){
    gulp.src(path.src.js) //select js files
        .pipe(rigger()) //process js files through rigger
        .pipe(uglify()) //compress js
        .pipe(gulp.dest(path.build.js)); //write result files
});


gulp.task('js:build_uncompressed', function(){
    gulp.src(path.src.js_uncompressed,{base: './'}) //select source js
        .pipe(gulp.dest(path.build_uncompressed.js));  //write result files
});


//task for css
gulp.task('style:build', function(){
    gulp.src(path.src.style)
       // .pipe(sourcemaps.init())
       // .pipe(sass())
      //  .pipe(prefixer())
        .pipe(cssmin())
      //  .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))

});

gulp.task('style:build_uncompressed', function(){
    gulp.src(path.src.style)
        .pipe(gulp.dest(path.build_uncompressed.css))
});

gulp.task('contentFolder:build', function(){
    gulp.src(path.src.content)
        .pipe(gulp.dest(path.build_uncompressed.content))
        .pipe(gulp.dest(path.build.content))
});

gulp.task('externalScripts:build', function(){
    gulp.src(path.src.external)
        .pipe(gulp.dest(path.build_uncompressed.external))
        .pipe(gulp.dest(path.build.external))
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
//        .pipe(reload({stream:true}));
});


gulp.task('clean', function(cb){
    rimraf(path.clean, cb);
});

gulp.task('build', [
    'clean',
    'html:build',
    'html:build_uncompressed',
    'js:build',
    'js:build_uncompressed',
    'style:build',
    'style:build_uncompressed',
    'contentFolder:build',
    'externalScripts:build'
]);

