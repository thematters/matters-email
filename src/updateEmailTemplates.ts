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
    console.info('\x1b[36m%s\x1b[0m', 'updating develoment email templates...')
    return [
      {
        templateId: 'd-a3f5decf7e1a402c8f929df3ac9c0760',
        name: 'Verification Code (Dev)',
        templateFile: 'verificationCode-zh-TW.html',
      },
      {
        templateId: 'd-4b3f3aad36c148faa4370e00d992052e',
        name: 'Verification Code (Dev)',
        templateFile: 'verificationCode-zh-CN.html',
      },
      {
        templateId: 'd-afaf751ebcac49e98e82b2aa061eea04',
        name: 'Register Success (Dev)',
        templateFile: 'registerSuccess-zh-TW.html',
      },
      {
        templateId: 'd-b56f8e941fbc43c4a129d652bf59d26b',
        name: 'Register Success (Dev)',
        templateFile: 'registerSuccess-zh-CN.html',
      },
      {
        templateId: 'd-5ba934f56f644888a457b03c4528a17a',
        name: 'Payment (Dev)',
        templateFile: 'payment-zh-TW.html',
      },
      {
        templateId: 'd-42b8a820afd5430ea103ea96b8db107e',
        name: 'Payment (Dev)',
        templateFile: 'payment-zh-CN.html',
      },
      {
        templateId: 'd-ed73bc5a51ef491c9ce5bb0bea1b59d7',
        name: 'Daily Summary (Dev)',
        templateFile: 'dailySummary-zh-TW.html',
      },
      {
        templateId: 'd-826d96247fb84b348687d6959e26a9e8',
        name: 'Daily Summary (Dev)',
        templateFile: 'dailySummary-zh-CN.html',
      },
      {
        templateId: 'd-b692e304e7e44efc9acefd74467b1def',
        name: 'User Deleted (Dev)',
        templateFile: 'userDeleted-zh-TW.html',
      },
      {
        templateId: 'd-ed486801cb274a2e9b57e103de6dd777',
        name: 'User Deleted (Dev)',
        templateFile: 'userDeleted-zh-CN.html',
      },
      {
        templateId: 'd-dfa5c65af9544750a2a9f24889f733c2',
        name: 'Migration Success (Dev)',
        templateFile: 'migrationSuccess-zh-TW.html',
      },
      {
        templateId: 'd-ccab86e903f44b62b5a4ddc432c8cfed',
        name: 'Migration Success (Dev)',
        templateFile: 'migrationSuccess-zh-CN.html',
      },
      {
        templateId: 'd-1000907c83b24c2ead0979e97f48b7ef',
        name: 'Churn User (Dev)',
        templateFile: 'churnUser-zh-TW.html',
      },
      {
        templateId: 'd-079a09367ebf4f37b1df7ea7f8f358c6',
        name: 'Churn User (Dev)',
        templateFile: 'churnUser-zh-CN.html',
      },
      {
        templateId: 'd-d16cef09ebdd408db1fa246097fbf755',
        name: 'Adopt Tag (Dev)',
        templateFile: 'adoptTag-zh-TW.html',
      },
      {
        templateId: 'd-fc6bda88521d406e9a1702e8139ea551',
        name: 'Adopt Tag (Dev)',
        templateFile: 'adoptTag-zh-CN.html',
      },
      {
        templateId: 'd-edb212fac34b421f8ac33b31e49d9b42',
        name: 'Assign As Tag Editor (Dev)',
        templateFile: 'assignAsTagEditor-zh-TW.html',
      },
      {
        templateId: 'd-9d920cb5f28c49cc9274296e17a01c1a',
        name: 'Assign As Tag Editor (Dev)',
        templateFile: 'assignAsTagEditor-zh-CN.html',
      },
      {
        templateId: 'd-6318c4b87fba4e6aa85ebce34891102d',
        name: 'Circle Invitation (Dev)',
        templateFile: 'circleInvitation-zh-TW.html',
      },
      {
        templateId: 'd-b0db4625f09f49c9aab49d6fc1a7cc62',
        name: 'Circle Invitation (Dev)',
        templateFile: 'circleInvitation-zh-CN.html',
      },
      {
        templateId: 'd-ff03cb1841af4eb18217e41d302bcf14',
        name: 'Crypto Wallet Airdrop (Dev)',
        templateFile: 'cryptoWalletAirdrop-zh-TW.html',
      },
      {
        templateId: 'd-c7d0391b24ad42aeb8aa26fbd23ce587',
        name: 'Crypto Wallet Airdrop (Dev)',
        templateFile: 'cryptoWalletAirdrop-zh-CN.html',
      },
      {
        templateId: 'd-d719ea86d1a644beb002634a1bde9c7f',
        name: 'Crypto Wallet Airdrop English (Dev)',
        templateFile: 'cryptoWalletAirdropEnglish-zh-TW.html',
      },
      {
        templateId: 'd-969c5b62d3ac4f6fb92c25687e30260e',
        name: 'Crypto Wallet Airdrop English (Dev)',
        templateFile: 'cryptoWalletAirdropEnglish-zh-CN.html',
      },
      {
        templateId: 'd-ff2c174d8df04cf8989bbc991f3759ff',
        name: 'Crypto Wallet Connected (Dev)',
        templateFile: 'cryptoWalletConnected-zh-TW.html',
      },
      {
        templateId: 'd-733b14b0a0e34d02a57e629fb78e2c74',
        name: 'Crypto Wallet Connected (Dev)',
        templateFile: 'cryptoWalletConnected-zh-CN.html',
      },
      {
        templateId: 'd-519dc29234a647eabbb2d122e821bd1b',
        name: 'Crypto Wallet Connected English (Dev)',
        templateFile: 'cryptoWalletConnectedEnglish-zh-TW.html',
      },
      {
        templateId: 'd-4aeea30b380946698eefc98104550ee2',
        name: 'Crypto Wallet Connected English (Dev)',
        templateFile: 'cryptoWalletConnectedEnglish-zh-CN.html',
      },
      {
        templateId: 'd-3ffc4145b5784177a91a2a30ebad8a78',
        name: 'User Retention (Dev)',
        templateFile: 'userRetention-zh-CN.html',
      },
      {
        templateId: 'd-2eee98d3d8784567bd75e8a5dfd98ea2',
        name: 'User Retention (Dev)',
        templateFile: 'userRetention-zh-TW.html',
      },
      {
        templateId: 'd-38b1286c9cd141f4a7d3328ea59b1d7d',
        name: 'Email Change (Dev)',
        templateFile: 'emailChange-zh-CN.html',
      },
      {
        templateId: 'd-a066211b9e1240f1a15b28def291b2f4',
        name: 'Email Change (Dev)',
        templateFile: 'emailChange-zh-TW.html',
      },
      {
        templateId: 'd-92a196a026a34b93be3f333e9a727743',
        name: 'qf-notices (Dev)',
        templateFile: 'qf-notices-zh-CN.html',
      },
      {
        templateId: 'd-412fa15cac77472f81beae3227bc2b65',
        name: 'qf-notices (Dev)',
        templateFile: 'qf-notices-zh-TW.html',
      },
      {
        templateId: 'd-a8431154b8c54cbc8fffa02dc9f117b9',
        name: 'qf-notices (Dev)',
        templateFile: 'qf-notices-en.html',
      },
    ]
  } else if (env === 'production') {
    console.log('\x1b[36m%s\x1b[0m', 'updating production email templates...')
    return [
      {
        templateId: 'd-1ff6f3a732fb4d5c8dd80b6e1a04254d',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-TW.html',
      },
      {
        templateId: 'd-c0fc5c93eab54bf787589e92a669e99c',
        name: 'Verification Code',
        templateFile: 'verificationCode-zh-CN.html',
      },
      {
        templateId: 'd-3dcf611ba3c54b9a93e55d058b0466f4',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-TW.html',
      },
      {
        templateId: 'd-a6fd21a85d06442d8f91f2533cb84b35',
        name: 'Register Success',
        templateFile: 'registerSuccess-zh-CN.html',
      },
      {
        templateId: 'd-d33821dd294d4c168581d0614002fe12',
        name: 'Payment',
        templateFile: 'payment-zh-TW.html',
      },
      {
        templateId: 'd-62f1d9378c7c4b95bdcdfe2d00849770',
        name: 'Payment',
        templateFile: 'payment-zh-CN.html',
      },
      {
        templateId: 'd-582228566ac34cd4a97d193d6ca8fbf6',
        name: 'Daily Summary',
        templateFile: 'dailySummary-zh-TW.html',
      },
      {
        templateId: 'd-6f7dc3a0f5f346a998e66f506be12a3c',
        name: 'Daily Summary',
        templateFile: 'dailySummary-zh-CN.html',
      },
      {
        templateId: 'd-4ccc229e825c4914963776d313408075',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-TW.html',
      },
      {
        templateId: 'd-e91201cd3b74425dbf54e775959602bc',
        name: 'User Deleted',
        templateFile: 'userDeleted-zh-CN.html',
      },
      {
        templateId: 'd-2283f0b9ac944293aa0b7f9a73994706',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-TW.html',
      },
      {
        templateId: 'd-f87c47b1c5f04a4fa8a5f40e43a2880e',
        name: 'Migration Success',
        templateFile: 'migrationSuccess-zh-CN.html',
      },
      {
        templateId: 'd-8e4fcaf2083e4309856af542d56b35e4',
        name: 'Churn User',
        templateFile: 'churnUser-zh-TW.html',
      },
      {
        templateId: 'd-065e302361c74465b3a79bec64a82895',
        name: 'Churn User',
        templateFile: 'churnUser-zh-CN.html',
      },
      {
        templateId: 'd-908c71d6c0b5462bae032b47f5a9933f',
        name: 'Adopt Tag',
        templateFile: 'adoptTag-zh-TW.html',
      },
      {
        templateId: 'd-67d46f077cb3454ea2501b90b02b0f7e',
        name: 'Adopt Tag',
        templateFile: 'adoptTag-zh-CN.html',
      },
      {
        templateId: 'd-e925af9b55674f2e84442c1e9897c5c6',
        name: 'Assign As Tag Editor',
        templateFile: 'assignAsTagEditor-zh-TW.html',
      },
      {
        templateId: 'd-9b4824514b704679a344410d6f466308',
        name: 'Assign As Tag Editor',
        templateFile: 'assignAsTagEditor-zh-CN.html',
      },
      {
        templateId: 'd-f1ddf65dbf2d4fbabe3994e5c2187beb',
        name: 'Circle Invitation',
        templateFile: 'circleInvitation-zh-TW.html',
      },
      {
        templateId: 'd-67a84b674fd74ccca53bb807c4f04557',
        name: 'Circle Invitation',
        templateFile: 'circleInvitation-zh-CN.html',
      },
      {
        templateId: 'd-0c1816da5a034282b1a5ddc70fe234b6',
        name: 'Crypto Wallet Airdrop',
        templateFile: 'cryptoWalletAirdrop-zh-TW.html',
      },
      {
        templateId: 'd-a54a5f0f26304b0a9dfbb9121725abff',
        name: 'Crypto Wallet Airdrop',
        templateFile: 'cryptoWalletAirdrop-zh-CN.html',
      },
      {
        templateId: 'd-67e0c8d057c3400889d9c0c2183857c5',
        name: 'Crypto Wallet Airdrop English',
        templateFile: 'cryptoWalletAirdropEnglish-zh-TW.html',
      },
      {
        templateId: 'd-83d6afe015db4501bb9978cb0dbfe15f',
        name: 'Crypto Wallet Airdrop English',
        templateFile: 'cryptoWalletAirdropEnglish-zh-CN.html',
      },
      {
        templateId: 'd-e0e81b8623754b66900da04c2d2d8a25',
        name: 'Crypto Wallet Connected',
        templateFile: 'cryptoWalletConnected-zh-TW.html',
      },
      {
        templateId: 'd-cb91338f36de4370a066e27c880a7c04',
        name: 'Crypto Wallet Connected',
        templateFile: 'cryptoWalletConnected-zh-CN.html',
      },
      {
        templateId: 'd-5c8be8fa0eb34c25b857213f161afa94',
        name: 'Crypto Wallet Connected English',
        templateFile: 'cryptoWalletConnectedEnglish-zh-TW.html',
      },
      {
        templateId: 'd-1f8cbb69ef644a65b12b4c99ccd22381',
        name: 'Crypto Wallet Connected English',
        templateFile: 'cryptoWalletConnectedEnglish-zh-CN.html',
      },
      {
        templateId: 'd-439649cf75714fbf8003914eef1af4c4',
        name: 'User Retention',
        templateFile: 'userRetention-zh-CN.html',
      },
      {
        templateId: 'd-8152febbdbd843759cd29145dd80e523',
        name: 'User Retention',
        templateFile: 'userRetention-zh-TW.html',
      },
      {
        templateId: 'd-b2e64ec8a843468aa1e3d3d11ba546a4',
        name: 'Email Change',
        templateFile: 'emailChange-zh-CN.html',
      },
      {
        templateId: 'd-2011e60c53e94a1c94bcb8d9c1545944',
        name: 'Email Change',
        templateFile: 'emailChange-zh-TW.html',
      },
      {
        templateId: 'd-bff60d3fedc649bcbfafc3d53de3d0e7',
        name: 'qf-notices',
        templateFile: 'qf-notices-zh-CN.html',
      },
      {
        templateId: 'd-0aec44ece1b6400da77a01d5f02bf108',
        name: 'qf-notices',
        templateFile: 'qf-notices-zh-TW.html',
      },
      {
        templateId: 'd-64032799a18b4379a90f41e1bb51c2e3',
        name: 'qf-notices',
        templateFile: 'qf-notices-en.html',
      },
    ]
  } else {
    return []
  }
})()

// invoke
;(async function main() {
  const args = process.argv.slice(2)
  const stripPrefix = args?.[0] === '--prefix' ? new RegExp(args?.[1]) : null

  for (const t of TEMPLATES.filter(
    ({ name, templateFile }) =>
      stripPrefix == null ||
      stripPrefix.test(name) ||
      stripPrefix.test(templateFile)
  )) {
    createTemplateVersion(
      t.templateId,
      t.name,
      `${TEMPLATE_ROOT}${t.templateFile}`
    )
  }
})()
