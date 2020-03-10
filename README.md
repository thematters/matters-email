# Matters Localizable Email Templates

MJML itself does not support i18n feature. This build flow will pipe MJML output html files to `gulp-html-i18n` to support localization.

## Usage

- copy `.env.example` to `.env`, and input sendgrid key for `MATTERS_SENDGRID_API_KEY`
- `npm run start` to start a hot-reload server to make modifications
- `npm run build` for build mjml and i18n html files without start the hot-reload server
- `npm run upload:dev` to upload build email templates to sendgrid development templates
- `npm run upload:prod` to upload build email templates to sendgrid production templates

## Add New Template

- add the sendgrid templates for all languages for `development` and `production` environments
- create a new mjml file in `src/templates`, update, test and build
- config `templateId`, `name`, `templateFile` for `development` and `production` environments in `src/updateEmailTemplates.ts`

## Support Localization

`gulp-html-i18n` default template render enginer uses `${{}}$` as delimiters

## Reference

- https://www.npmjs.com/package/gulp-html-i18n
