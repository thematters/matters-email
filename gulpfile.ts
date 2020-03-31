import * as gulp from 'gulp'
import * as mjml from 'gulp-mjml'
import * as i18n from 'gulp-html-i18n'
import * as browserSync from 'browser-sync'
import * as minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

const basePaths = {
  translationSrc: './lang/',
  templatesSrc: './src/templates/',
  i18nTemplatesOutput: './build/i18n-emails/',
  mjmlOutputDest: './build/emails/',
}

const paths = {
  i18n: {
    emailsSrc: basePaths.templatesSrc + '/**/*.mjml',
    languagesSrc: basePaths.translationSrc,
    dest: basePaths.i18nTemplatesOutput,
  },
  mjml: {
    src: basePaths.i18nTemplatesOutput + '*.mjml',
    dest: basePaths.mjmlOutputDest,
  },
  watch: [basePaths.templatesSrc, basePaths.translationSrc],
}

const generateLocalizedEmailTemplates = () => {
  return gulp
    .src(paths.i18n.emailsSrc)
    .pipe(
      i18n({
        langDir: paths.i18n.languagesSrc,
      })
    )
    .pipe(gulp.dest(paths.i18n.dest))
}

const buildMjmlToHtml = () => {
  return gulp.src(paths.mjml.src).pipe(mjml()).pipe(gulp.dest(paths.mjml.dest))
}

/** Dev server */
const server = (done) => {
  let watchDir = paths.mjml.dest

  // $gulp --mjml
  // will start watch for lokalised emails
  if (argv.mjml) {
    watchDir = paths.mjml.dest
  }

  const options = {
    server: {
      baseDir: watchDir,
      directory: true,
    },
    port: '8000',
    notify: false,
  }

  browserSync.init(options)

  done()
}

const watch = () => {
  gulp
    .watch(paths.watch)
    .on(
      'change',
      gulp.series(
        generateLocalizedEmailTemplates,
        buildMjmlToHtml,
        browserSync.reload
      )
    )
}

gulp.task(
  'build',
  gulp.series(generateLocalizedEmailTemplates, buildMjmlToHtml)
)
gulp.task('default', gulp.series('build', gulp.parallel(server, watch)))
