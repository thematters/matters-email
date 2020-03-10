# Matters Localizable Email Templates

MJML itself does not support i18n feature. This build flow will pipe MJML output html files to `gulp-html-i18n` to support localization.

## Usage

- copy `.env.example` to `.env`, and input sendgrid key for `MATTERS_SENDGRID_API_KEY`
- `npm run start` to start a hot-reload server to make modifications
- `npm run build` for build mjml and i18n html files without start the hot-reload server
- `npm run upload:dev` to upload build email templates to sendgrid development templates
- `npm run upload:prod` to upload build email templates to sendgrid production templates

## Template Language

`gulp-html-i18n` default template render enginer uses `${{}}$` as delimiters

## Reference

- https://www.npmjs.com/package/gulp-html-i18n
