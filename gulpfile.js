const gulp = require('gulp');

// Delete all previously built files
gulp
    .task(
        'clean:min-css',
        () => {

            const
                del = require('del')
            ;

            return del(
                [
                    'css/dist/*.css',
                ]
            )
        }
);

gulp
    .task(
        'lint-css',
        function lintCssTask()
        {
            const
                gulpStylelint = require('gulp-stylelint')
            ;

            return gulp
                    .src(
                        [
                            'css/src/*.css',
                        ]
                    )
                    .pipe(
                        gulpStylelint(
                            {
                                reporters: [ {formatter: 'string', console: true} ],
                            }
                        )
                    );
            }
);

//General build for development purposes
gulp
    .task(
        'build',
        gulp
            .series(
                'clean:min-css',
                () => {
                    const
                        cssimport = require('gulp-cssimport'),
                        concatCss = require('gulp-concat-css'),
                        postcss = require('gulp-postcss'),
                        postCSSCustomProperties = require('postcss-custom-properties'),
                        sourcemaps = require('gulp-sourcemaps'),
                        autoprefixer = require('gulp-autoprefixer')
                    ;

                    return gulp
                            .src(
                                    'css/src/*.css'
                            )
                            .pipe(cssimport({})) // process imports
                            .pipe(concatCss('main.bundle.css'))
                            .pipe(sourcemaps.init())
                            .pipe(
                                postcss(
                                    [
                                        postCSSCustomProperties(),
                                    ]
                                )
                            )
                            .pipe(
                                    autoprefixer({cascade: false})
                            )
                            .pipe(sourcemaps.write('.'))
                            .pipe(gulp.dest('css/dist/'))
                    ;
                }
        )
    )
;

//General build for development purposes
gulp
    .task(
        'build-live',
        gulp
            .series(
                'build',
                () => {
                    const
                        cssnano = require('gulp-cssnano')
                    ;

                    return gulp
                            .src(
                                    'css/dist/main.bundle.css'
                            )
                            .pipe(cssnano())
                            .pipe(gulp.dest('css/dist/'))
                    ;
                }
        )
    )
;



