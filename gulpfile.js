const gulp        = require('gulp');
const sass        = require('gulp-sass');
const concat = require("gulp-concat");
const autoprefix = require("gulp-autoprefixer");


// source directories
const sourceSass = "./sass/index.sass";
const distCSS = "./css/";

gulp.task('sass', () => {
    return gulp.src(sourceSass)
        .pipe(sass({
             // outputStyle: 'compressed'
        }))
        .pipe(concat('main.css'))
        .pipe(autoprefix({
            browsersList: ['last 8 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(distCSS))
});

gulp.task('sass', gulp.series('sass'));