import * as dotenv from 'dotenv'
import { promises as fs } from 'fs'
import 'module-alias/register'
import * as request from 'request-promise-native'

dotenv.config()

const env = process.env.ENV || 'development'

/*
 * prepare http request options for sendgrid web API
 */
const getOptions = (method: string, path: string, body = {}) => {
  const uri = `https://api.sendgrid.com/v3/${path}`
  const options = {
    method,
    uri,
    headers: {
      authorization: `Bearer ${process.env.MATTERS_SENDGRID_API_KEY}`,
      'content-type': 'application/json'
    },
    body,
    json: true
  }

  return options
}

/**
 * get a list of version IDs for a dynamic template
 */
const getTemplateVersions = async (templateId: string) => {
  const options = getOptions('GET', `templates/${templateId}`)
  const result = await request(options)
  const v: string[] = []
  for (const version of result.versions) {
    v.push(version.id)
  }
  console.log(v)
  return v
}

/**
 * remove all versions of a template except the latest one
 */
const deleteTemplateVersions = async (templateId: string) => {
  const versions = await getTemplateVersions(templateId)
  for (const v of versions.slice(1)) {
    const options = getOptions('DELETE', `templates/${templateId}/versions/${v}`)
    await request(options)
    return
  }
}

/**
 * upload a new dynamic template version to sendgrid
 */
const createTemplateVersion = async (templateId: string, name: string, file: string) => {
  try {
    // remove older versions first
    const tplData = await fs.readFile(file)
    const template = Buffer.from(tplData).toString()
    await deleteTemplateVersions(templateId)
    const body = {
      template_id: templateId,
      active: 1,
      name,
      subject: '{{subject}}',
      html_content: template
    }
    const options = getOptions('POST', `templates/${templateId}/versions`, body)
    const result = await request(options)
    console.log(result)
  } catch (err) {
    console.log(`Error occurs: ${err}`)
    process.exit(1)
  }
}

/* ======================= */
// declare templates
const TEMPLATE_ROOT = 'build/emails/'
const TEMPLATES = (() => {
  if (env === 'development') {
    return [
      {
        templateId: 'd-805ccf4182244f59a5388b581df1eeab',
        name: 'Daily Summary',
        templateFile: 'dailySummay-zh-TW.html'
      },
      {
        templateId: 'd-e242f3e39f014279966e43425b208cbe',
        name: 'Daily Summary',
        templateFile: 'dailySummay-zh-CN.html'
      },
      {
        templateId: 'd-b370a6eddc394814959b49db1ba4cfec',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-TW.html'
      },
      {
        templateId: 'd-9774a8882f914afaa43e2634a234762b',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-CN.html'
      },
      {
        templateId: 'd-250ba94c759948cbb2bd9f94089d13b8',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-TW.html'
      },
      {
        templateId: 'd-92b184faf2aa48fb8645600f2540cfb4',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-CN.html'
      },
      {
        templateId: 'd-06a6075fefe54a0f96157f69a726e46e',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-TW.html'
      },
      {
        templateId: 'd-0be942cd60ff4082b35ab836b60a728f',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-CN.html'
      },
      {
        templateId: 'd-a86e6f1c1fc24379b4b21244f111161b',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-TW.html'
      },
      {
        templateId: 'd-c0b89ae6e8fe4eed8f05277853561976',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-CN.html'
      }
    ]
  } else if (env === 'production') {
    console.log('\x1b[36m%s\x1b[0m', 'updating production email templates...')
    return [
      {
        templateId: 'd-805ccf4182244f59a5388b581df1eeab',
        name: 'Daily Summary',
        templateFile: 'dailySummay-zh-TW.html'
      },
      {
        templateId: 'd-e242f3e39f014279966e43425b208cbe',
        name: 'Daily Summary',
        templateFile: 'dailySummay-zh-CN.html'
      },
      {
        templateId: 'd-b370a6eddc394814959b49db1ba4cfec',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-TW.html'
      },
      {
        templateId: 'd-9774a8882f914afaa43e2634a234762b',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-CN.html'
      },
      {
        templateId: 'd-250ba94c759948cbb2bd9f94089d13b8',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-TW.html'
      },
      {
        templateId: 'd-92b184faf2aa48fb8645600f2540cfb4',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-CN.html'
      },
      {
        templateId: 'd-06a6075fefe54a0f96157f69a726e46e',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-TW.html'
      },
      {
        templateId: 'd-0be942cd60ff4082b35ab836b60a728f',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-CN.html'
      },
      {
        templateId: 'd-a86e6f1c1fc24379b4b21244f111161b',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-TW.html'
      },
      {
        templateId: 'd-c0b89ae6e8fe4eed8f05277853561976',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-CN.html'
      }
    ]
  } else {
    return []
  }
})()

// invoke
;(async () => {
  for (const t of TEMPLATES) {
    createTemplateVersion(t.templateId, t.name, `${TEMPLATE_ROOT}${t.templateFile}`)
  }
})()
