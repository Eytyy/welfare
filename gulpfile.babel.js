import _gulp from 'gulp';
import gulpHelp from 'gulp-help';
// import data from 'gulp-data';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import del from 'del';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';

const gulp = gulpHelp(_gulp);
const reload = browserSync.reload;

const root = {
  src: './src',
  dest: './app',
};

const paths = {
  styles: {
    src: `${root.src}/styles/**/*.scss`,
    dest: `${root.dest}/styles/`,
  },
  scripts: {
    src: `${root.src}/scripts/**/*.js`,
    dest: `${root.dest}/scripts/`,
  },
  html: {
    src: `${root.src}/index.html`,
    dest: `${root.dest}/`,
  },
  fonts: {
    src: `${root.src}/fonts/**/*`,
    dest: `${root.dest}/fonts`,
  },
  images: {
    src: `${root.src}/images/**/*`,
    dest: `${root.dest}/images`,
  },
  data: {
    src: `${root.src}/data/**/*.json`,
    dest: `${root.dest}/data`,
  },
  templates: {
    src: `${root.src}/templates/**/*.js`,
    dest: `${root.dest}/templates`,
  },
  resources: {
    src: `${root.src}/resources/**/*`,
    dest: `${root.dest}/resources`,
  },
};

// Start of styles related tasks ------------------------------------------
gulp.task('styles', 'Convert Sass to CSS', () => {
  gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
    // .pipe(reload({ stream: true }));
});
// End of styles related tasks  -------------------------------------------

gulp.task('copyData', 'copy data from src to dest', () => {
  gulp.src(paths.data.src)
    .pipe(gulp.dest(paths.data.dest));
    // .pipe(reload({ stream: true }));
});

gulp.task('movetemplates', 'copy templates', () => {
  gulp.src(paths.templates.src)
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(paths.templates.dest));
    // .pipe(reload({ stream: true }));
});

gulp.task('copyResources', 'copy resorces from src to dest', () => {
  gulp.src(paths.resources.src)
    .pipe(gulp.dest(paths.resources.dest));
});

// Start of HTML related tasks --------------------------------------------
// const dataPath = `${root.src}/data`;
// const templatesPath = `${root.src}/html`;

gulp.task('html', 'copy HTML files and move to dest folder', () => {
  gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
    // .pipe(reload({ stream: true }));
});
// End of HTML related tasks   --------------------------------------------


// Start of Images related tasks --------------------------------------------
gulp.task('images', 'Optimize images and move to dest folder', () => {
  gulp.src(paths.images.src)
    .pipe(changed(paths.images.dest)) // ignore unchanged files
    .pipe(imagemin()) // optimize
    .pipe(gulp.dest(paths.images.dest));
    // .pipe(reload({ stream: true }));
});
// End of Images related tasks   --------------------------------------------


// Start of Fonts related tasks --------------------------------------------
gulp.task('fonts', 'copy and move font files', () => {
  gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
    // .pipe(reload({ stream: true }));
});
// End of Fonts related tasks   --------------------------------------------


// Start of ES6 related tasks ---------------------------------------------
// Clean Task
gulp.task('clean-templates', 'remove generated template files in dest directory', () => {
  del([paths.templates.dest]);
});

gulp.task('clean-scripts', 'remove generated script files in dest directory', () => {
  del([paths.scripts.dest]);
});

// Babel Task
gulp.task('babel', 'Generate es6 files in dest directory', () => {
  gulp.src(paths.scripts.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.scripts.dest));
    // .pipe(reload({ stream: true }));
});

// Both (clean dest file the regenerate files in es6 compliant format using babel) Tasks
gulp.task('es6', 'Generate the es6 library in dest', ['clean-scripts', 'babel']);

gulp.task('templates', 'templates task', ['clean-templates', 'movetemplates']);

// End of ES6 related tasks -----------------------------------------------


// Start of lint related tasks --------------------------------------------
gulp.task('lint', 'run eslint on all the source files', () => {
  gulp.src(paths.scripts.src)
    .pipe(eslint())
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
// End of lint related tasks ----------------------------------------------


// Start of watch related tasks -------------------------------------------
gulp.task('watch', 'Watcher task', () => {
  gulp.watch(paths.data.src, ['data']);
  gulp.watch(paths.html.src, ['html']);
  gulp.watch(paths.styles.src, ['styles']);
  gulp.watch(paths.scripts.src, ['lint', 'babel']);
  gulp.watch(paths.templates.src, ['templates']);
});
// End of watch related tasks ---------------------------------------------


// Start of serve related tasks -------------------------------------------
gulp.task('serve', 'serve resources', () => {
  browserSync({
    server: './app',
  });
});
// End of serve related tasks ---------------------------------------------
gulp.task('default', ['help', 'copyData', 'copyResources', 'templates', 'fonts', 'images', 'html', 'styles', 'babel', 'watch']);

// gulp.task('default', ['help', 'copyData', 'templates', 'fonts', 'images', 'html', 'styles', 'babel', 'serve', 'watch']);
