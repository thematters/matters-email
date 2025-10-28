# Email Template Generation System

This document explains how the Matters email template system works, from source templates to final SendGrid deployment.

## Overview

The email system uses a multi-stage build process that transforms MJML templates into localized HTML emails and deploys them to SendGrid as dynamic templates. The system supports multiple languages (English, Simplified Chinese, Traditional Chinese) and maintains separate development and production environments.

## Architecture

### Core Components

1. **Source Templates** (`src/templates/`) - MJML template files
2. **Language Files** (`lang/`) - YAML translation files
3. **Build System** (`gulpfile.ts`) - Gulp-based build pipeline
4. **Deployment Script** (`src/updateEmailTemplates.ts`) - SendGrid API integration
5. **Build Output** (`build/`) - Generated HTML files

### Directory Structure

```
src/
├── templates/           # Source MJML templates
│   ├── *.mjml         # Main template files
│   └── partials/       # Reusable template components
├── updateEmailTemplates.ts  # SendGrid deployment script

lang/
├── en/                 # English translations
├── zh-CN/             # Simplified Chinese translations
└── zh-TW/             # Traditional Chinese translations

build/
├── i18n-emails/       # Localized MJML files (intermediate)
└── emails/            # Final HTML files
```

## Build Process

The build process consists of two main stages:

### Stage 1: Internationalization (i18n)

**Input:** Source MJML templates + Language YAML files  
**Output:** Localized MJML files  
**Tool:** `gulp-html-i18n`

The i18n process:
1. Scans all `.mjml` files in `src/templates/`
2. Replaces `${{key}}$` placeholders with translated text from YAML files
3. Replaces `${{_lang_}}$` with the language code (en, zh-CN, zh-TW)
4. Generates separate MJML files for each language in `build/i18n-emails/`

**Example transformation:**
```mjml
<!-- Source template -->
<mj-title>${{verificationCode.register.title}}$</mj-title>

<!-- After i18n (zh-CN) -->
<mj-title>Matters | 注册</mj-title>
```

### Stage 2: MJML to HTML Conversion

**Input:** Localized MJML files  
**Output:** HTML email files  
**Tool:** `gulp-mjml`

The MJML conversion:
1. Processes localized MJML files from `build/i18n-emails/`
2. Compiles MJML to responsive HTML
3. Generates final HTML files in `build/emails/`

## Template Structure

### Main Templates

Each email type has a corresponding MJML template in `src/templates/`:

- `verificationCode.mjml` - Account verification emails
- `dailySummary.mjml` - Daily digest emails
- `payment.mjml` - Payment-related emails
- `userDeleted.mjml` - Account deletion notifications
- And many more...

### Partials System

Reusable components are stored in `src/templates/partials/`:

- `head-{lang}.mjml` - Email head section
- `header-{lang}.mjml` - Email header
- `footer-{lang}.mjml` - Email footer
- `verificationCodeContent-{lang}.mjml` - Verification code content
- `articleDigest-{lang}.mjml` - Article summary component

### Language Files

Each template has corresponding YAML files in `lang/{language}/`:

```yaml
# lang/zh-CN/verificationCode.yaml
register:
  title: Matters | 注册
  button_text: 登录帐号
  content_1: '欢迎注册 Matters！<br>点击下方按钮登录你的 Matters 帐号以完成注册：'
```

## Localization System

### Placeholder Syntax

The system uses `${{key}}$` syntax for translations:

```mjml
<mj-text>${{verificationCode.register.content_1}}$</mj-text>
```

### Language-Specific Partials

Partials are automatically localized using the `${{_lang_}}$` placeholder:

```mjml
<mj-include path="./partials/header-${{_lang_}}$.mjml" />
```

This becomes:
- `./partials/header-en.mjml` for English
- `./partials/header-zh-CN.mjml` for Simplified Chinese
- `./partials/header-zh-TW.mjml` for Traditional Chinese

### Supported Languages

- **en** - English
- **zh-CN** - Simplified Chinese
- **zh-TW** - Traditional Chinese

## Build Commands

### Development
```bash
npm run start
```
- Builds templates
- Starts hot-reload server on port 8000
- Watches for file changes and rebuilds automatically

### Production Build
```bash
npm run build
```
- Generates all localized HTML files
- No server, just builds the templates

## SendGrid Deployment

### Configuration

The deployment system maintains separate template configurations for development and production environments in `src/updateEmailTemplates.ts`.

Each template entry includes:
- `templateId` - SendGrid dynamic template ID
- `name` - Human-readable template name
- `templateFile` - Generated HTML file to upload

### Deployment Process

1. **Read Template Configuration** - Loads template mappings for current environment
2. **Read HTML Files** - Loads generated HTML from `build/emails/`
3. **Clean Old Versions** - Removes previous template versions (keeps only latest)
4. **Upload New Version** - Creates new template version in SendGrid
5. **Activate Template** - Sets the new version as active

### Deployment Commands

```bash
# Deploy to development
npm run upload:dev

# Deploy to production
npm run upload:prod

# Deploy specific templates (with prefix filter)
npm run upload:dev -- --prefix "verification"
```

### Environment Variables

Required environment variable:
- `MATTERS_SENDGRID_API_KEY` - SendGrid API key for authentication

## Template Variables

Templates support Handlebars-style variables for dynamic content:

### Common Variables
- `{{code}}` - Verification codes
- `{{link}}` - Action links
- `{{@root.recipient.email}}` - Recipient email address
- `{{copyrightYear}}` - Current year

### Conditional Logic
Templates use Handlebars conditionals for different email types:

```mjml
{{#if type.register}}
  ${{verificationCode.register.title}}$
{{/if}}

{{#if type.emailReset}}
  ${{verificationCode.emailReset.title}}$
{{/if}}
```

## File Naming Convention

### Generated Files
- **i18n-emails:** `{templateName}-{language}.mjml`
- **Final HTML:** `{templateName}-{language}.html`

Examples:
- `verificationCode-zh-CN.mjml`
- `dailySummary-en.html`
- `payment-zh-TW.html`

## Development Workflow

### Adding a New Template

1. **Create MJML Template** - Add new `.mjml` file in `src/templates/`
2. **Add Translations** - Create corresponding YAML files in `lang/{language}/`
3. **Create Partials** - Add language-specific partials if needed
4. **Test Locally** - Use `npm run start` to preview
5. **Configure SendGrid** - Add template mappings in `updateEmailTemplates.ts`
6. **Deploy** - Run deployment command

### Modifying Existing Templates

1. **Edit Source** - Modify MJML template or translations
2. **Preview Changes** - Use development server to see changes
3. **Build** - Run `npm run build` to generate final files
4. **Deploy** - Upload to SendGrid when ready

## Best Practices

### Template Design
- Use semantic MJML components for better email client compatibility
- Keep templates responsive and mobile-friendly
- Use partials for reusable components
- Test across different email clients

### Localization
- Use descriptive translation keys
- Maintain consistent terminology across languages
- Test all language variants
- Keep translations in sync

### Deployment
- Test in development environment first
- Use version control for template configurations
- Monitor SendGrid API limits
- Keep backup of working template versions

## Troubleshooting

### Common Issues

1. **Missing Translations** - Check YAML files for missing keys
2. **Build Failures** - Verify MJML syntax and file paths
3. **Deployment Errors** - Check SendGrid API key and template IDs
4. **Rendering Issues** - Test in multiple email clients

### Debug Commands

```bash
# Check build output
ls -la build/emails/

# Verify i18n output
ls -la build/i18n-emails/

# Test specific template
npm run upload:dev -- --prefix "templateName"
```

## Dependencies

### Build Tools
- **gulp** - Task runner
- **gulp-mjml** - MJML compilation
- **gulp-html-i18n** - Internationalization
- **browser-sync** - Development server

### Runtime Dependencies
- **mjml** - Email template engine
- **request** - HTTP client for SendGrid API
- **dotenv** - Environment variable management

This system provides a robust, scalable solution for managing multilingual email templates with automated deployment to SendGrid.
