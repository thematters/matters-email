const gulp = require('gulp')
const mjml = require('gulp-mjml')
const i18n = require('gulp-html-i18n')

const basePaths = {
  mjmlSrc: './src/templates/',
  mjmlOutputDest: './build/mjml-output/',
  translationSrc: './lang/',
  emailsOutputDest: './build/emails/'
}

const paths = {
  mjml: {
    src: basePaths.mjmlSrc + '*.mjml',
    dest: basePaths.mjmlOutputDest
  },
  i18n: {
    emailsSrc: basePaths.mjmlOutputDest + '*.html',
    languagesSrc: basePaths.translationSrc,
    dest: basePaths.emailsOutputDest
  }
}

function buildMjmlToHtml () {
  return gulp
    .src(paths.mjml.src)
    .pipe(mjml())
    .pipe(gulp.dest(paths.mjml.dest))
}

function generateLocalizedEmailTemplates () {
  return gulp
    .src(paths.i18n.emailsSrc)
    .pipe(i18n({ langDir: paths.i18n.languagesSrc }))
    .pipe(gulp.dest(paths.i18n.dest))
}

gulp.task('default', gulp.series(buildMjmlToHtml, generateLocalizedEmailTemplates))
