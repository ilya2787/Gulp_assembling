const gulp = require('gulp');

// HTML
const fileinclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webpHtml = require('gulp-webp-html');

//SCSS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const replace = require('gulp-replace');

const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');


gulp.task('clean:docs', function(done){
    if (fs.existsSync('./docs/')){
        return gulp.src('./docs/', {read: false})
            .pipe(clean({force: true}));
    }
    done();
});

const includeFileSetting = {
    prefix: '@@',
    basepatch: '@file'
};

const plumberConfig = (title) => {
    return {
         errorHandler: notify.onError({
        title: title,
        message: "Error: <%= error.message %>",
        sound: false
         }),
    }
};

gulp.task('html:docs', function(){
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs', {hasChanged: changed.compareContents}))
        .pipe(plumber(plumberConfig('HTML')))
        .pipe(fileinclude(includeFileSetting))
        .pipe(
			replace(
				/(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1./$4$5$7$1'
			)
        )
        .pipe(webpHtml())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs'))
});

gulp.task('sass:docs', function(){
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberConfig('SCSS')))
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(groupMedia())
        .pipe(webpCss())
        .pipe(sass())
        .pipe(
			replace(
				/(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1$2$3$4$6$1'
			)
		)
        .pipe(csso())
        .pipe(gulp.dest('./docs/css/'))
});

gulp.task('images:docs', function(){
    return gulp.src('./src/img/**/*' , { encoding: false })
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img/'))
        .pipe(gulp.src('./src/img/**/*' , { encoding: false }))
        .pipe(changed('./docs/img/'))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./docs/img/'));
});

gulp.task('fonts:docs', function(){
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('JS:docs', function(){
    return gulp.src('./src/js/*.js')
        .pipe(changed('./docs/js'))
        .pipe(plumber(plumberConfig('JS')))
        .pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./docs/js'));    
})

const settingServer = {
    livereload: true,
    open: true
};

gulp.task('server:docs', function(){
    return gulp.src('./docs/').pipe(server(settingServer))   
});

