import * as dotenv from 'dotenv'
import { promises as fs } from 'fs'
import 'module-alias/register'
import * as request from 'request-promise-native'

dotenv.config()

const env = process.env.MATTERS_ENV || 'development'

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
      'content-type': 'application/json',
    },
    body,
    json: true,
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
    const options = getOptions(
      'DELETE',
      `templates/${templateId}/versions/${v}`
    )
    await request(options)
    return
  }
}

/**
 * upload a new dynamic template version to sendgrid
 */
const createTemplateVersion = async (
  templateId: string,
  name: string,
  file: string
) => {
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
      html_content: template,
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
        templateFile: 'dailySummary-zh-TW.html',
      },
      {
        templateId: 'd-e242f3e39f014279966e43425b208cbe',
        name: 'Daily Summary',
        templateFile: 'dailySummary-zh-CN.html',
      },
      {
        templateId: 'd-b370a6eddc394814959b49db1ba4cfec',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-TW.html',
      },
      {
        templateId: 'd-9774a8882f914afaa43e2634a234762b',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-CN.html',
      },
      {
        templateId: 'd-250ba94c759948cbb2bd9f94089d13b8',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-TW.html',
      },
      {
        templateId: 'd-92b184faf2aa48fb8645600f2540cfb4',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-CN.html',
      },
      {
        templateId: 'd-06a6075fefe54a0f96157f69a726e46e',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-TW.html',
      },
      {
        templateId: 'd-0be942cd60ff4082b35ab836b60a728f',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-CN.html',
      },
      {
        templateId: 'd-a86e6f1c1fc24379b4b21244f111161b',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-TW.html',
      },
      {
        templateId: 'd-c0b89ae6e8fe4eed8f05277853561976',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-CN.html',
      },
      {
        templateId: 'd-f2df8dd4f3e24c7981ec152ccf6eb2ec',
        name: 'Churn User',
        templateFile: 'churnUser-zh-TW.html',
      },
      {
        templateId: 'd-0e2daefb95214cf9ad0f9cd0d2957636',
        name: 'Churn User',
        templateFile: 'churnUser-zh-CN.html',
      },
      {
        templateId: 'd-dd77980e9ec1477f98259c7e9fb4fc28',
        name: 'Payment',
        templateFile: 'payment-zh-TW.html',
      },
      {
        templateId: 'd-9fea53d8838e44c4be4b93d26b8f2e9a',
        name: 'Payment',
        templateFile: 'payment-zh-CN.html',
      },
      {
        templateId: 'd-88b64da37a3240a2b240b5fbdf944661',
        name: 'Adopt Tag',
        templateFile: 'adoptTag-zh-TW.html',
      },
      {
        templateId: 'd-2d9dda465f294e1e8a7e226a4165d0d9',
        name: 'Adopt Tag',
        templateFile: 'adoptTag-zh-CN.html',
      },
      {
        templateId: 'd-ea7389447e9d48549a7d0ad86b90fa9f',
        name: 'Assign As Tag Editor',
        templateFile: 'assignAsTagEditor-zh-TW.html',
      },
      {
        templateId: 'd-6fe4334692e2475dba68a135831f0f40',
        name: 'Assign As Tag Editor',
        templateFile: 'assignAsTagEditor-zh-CN.html',
      },
      {
        templateId: 'd-d3c45a17feb441eca8b979db18596b6c',
        name: 'Circle Invitation',
        templateFile: 'circleInvitation-zh-TW.html',
      },
      {
        templateId: 'd-80a66fac2361413bb4ea594cf0238d53',
        name: 'Circle Invitation',
        templateFile: 'circleInvitation-zh-CN.html',
      },
    ]
  } else if (env === 'production') {
    console.log('\x1b[36m%s\x1b[0m', 'updating production email templates...')
    return [
      {
        templateId: 'd-4a5a938cdc0c4020a1e2feb67a553946',
        name: 'Daily Summary',
        templateFile: 'dailySummary-zh-TW.html',
      },
      {
        templateId: 'd-7f4276f1b32f48a4a51df90cbbb1447a',
        name: 'Daily Summary',
        templateFile: 'dailySummary-zh-CN.html',
      },
      {
        templateId: 'd-231ada8640374adb9d79a0130480c801',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-TW.html',
      },
      {
        templateId: 'd-cce84e261e0f4e47a2f1e2296b784230',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-CN.html',
      },
      {
        templateId: 'd-df196f90da7743f6900906fc18487953',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-TW.html',
      },
      {
        templateId: 'd-f9373c61bdac43e1a24f221ceba4c61c',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-CN.html',
      },
      {
        templateId: 'd-765b335a77d244438891a62f023b8c2e',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-TW.html',
      },
      {
        templateId: 'd-30589f459aac4df1ab66e0f8af79fc4d',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-CN.html',
      },
      {
        templateId: 'd-47b788ce3754426fb2a6d3c80b9872eb',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-TW.html',
      },
      {
        templateId: 'd-2e7d84cd2965426b80eafcfdcd18776c',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-CN.html',
      },
      {
        templateId: 'd-0b1612857f9b474aba91679c8e0994d8',
        name: 'Churn User',
        templateFile: 'churnUser-zh-TW.html',
      },
      {
        templateId: 'd-d397d5ae9264436bb1e65a202174e6a9',
        name: 'Churn User',
        templateFile: 'churnUser-zh-CN.html',
      },
      {
        templateId: 'd-96ab5281c6bd419ebec20e8dbcbed427',
        name: 'Payment',
        templateFile: 'payment-zh-TW.html',
      },
      {
        templateId: 'd-b00c4b181721405ebcb9170b1f890075',
        name: 'Payment',
        templateFile: 'payment-zh-CN.html',
      },
      {
        templateId: 'd-20e5e339130d49d79fce853577f689d3',
        name: 'Adopt Tag',
        templateFile: 'adoptTag-zh-TW.html',
      },
      {
        templateId: 'd-6e8f11d55f3447fc9e4ab2f4aa13ff2f',
        name: 'Adopt Tag',
        templateFile: 'adoptTag-zh-CN.html',
      },
      {
        templateId: 'd-3dc33b89e89442fe8c25c51502c9f4d6',
        name: 'Assign As Tag Editor',
        templateFile: 'assignAsTagEditor-zh-TW.html',
      },
      {
        templateId: 'd-fba153b334af44cb9c1ecc3695eff9fc',
        name: 'Assign As Tag Editor',
        templateFile: 'assignAsTagEditor-zh-CN.html',
      },
      {
        templateId: 'd-409e5bce4c8343df828d9393a5a4c32d',
        name: 'Circle Invitation',
        templateFile: 'circleInvitation-zh-TW.html',
      },
      {
        templateId: 'd-75f9d85caae141278a8a816fa44ef9f7',
        name: 'Circle Invitation',
        templateFile: 'circleInvitation-zh-CN.html',
      },
    ]
  } else {
    return []
  }
})()

// invoke
;(async () => {
  for (const t of TEMPLATES) {
    createTemplateVersion(
      t.templateId,
      t.name,
      `${TEMPLATE_ROOT}${t.templateFile}`
    )
  }
})()
