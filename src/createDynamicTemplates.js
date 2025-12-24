/**
 * Node.js >= 16
 */

const templates = [
  {
    templateId: '',
    name: 'Verification Code',
    templateFile: 'verificationCode-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Verification Code',
    templateFile: 'verificationCode-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Register Success',
    templateFile: 'registerSuccess-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Register Success',
    templateFile: 'registerSuccess-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Payment',
    templateFile: 'payment-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Payment',
    templateFile: 'payment-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Daily Summary',
    templateFile: 'dailySummary-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Daily Summary',
    templateFile: 'dailySummary-zh-CN.html',
  },
  {
    templateId: '',
    name: 'User Deleted',
    templateFile: 'userDeleted-zh-TW.html',
  },
  {
    templateId: '',
    name: 'User Deleted',
    templateFile: 'userDeleted-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Migration Success',
    templateFile: 'migrationSuccess-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Migration Success',
    templateFile: 'migrationSuccess-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Churn User',
    templateFile: 'churnUser-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Churn User',
    templateFile: 'churnUser-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Adopt Tag',
    templateFile: 'adoptTag-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Adopt Tag',
    templateFile: 'adoptTag-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Assign As Tag Editor',
    templateFile: 'assignAsTagEditor-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Assign As Tag Editor',
    templateFile: 'assignAsTagEditor-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Circle Invitation',
    templateFile: 'circleInvitation-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Circle Invitation',
    templateFile: 'circleInvitation-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Crypto Wallet Airdrop',
    templateFile: 'cryptoWalletAirdrop-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Crypto Wallet Airdrop',
    templateFile: 'cryptoWalletAirdrop-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Crypto Wallet Airdrop English',
    templateFile: 'cryptoWalletAirdropEnglish-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Crypto Wallet Airdrop English',
    templateFile: 'cryptoWalletAirdropEnglish-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Crypto Wallet Connected',
    templateFile: 'cryptoWalletConnected-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Crypto Wallet Connected',
    templateFile: 'cryptoWalletConnected-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Crypto Wallet Connected English',
    templateFile: 'cryptoWalletConnectedEnglish-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Crypto Wallet Connected English',
    templateFile: 'cryptoWalletConnectedEnglish-zh-CN.html',
  },
  {
    templateId: '',
    name: 'User Retention',
    templateFile: 'userRetention-zh-CN.html',
  },
  {
    templateId: '',
    name: 'User Retention',
    templateFile: 'userRetention-zh-TW.html',
  },
  {
    templateId: '',
    name: 'Email Change',
    templateFile: 'emailChange-zh-CN.html',
  },
  {
    templateId: '',
    name: 'Email Change',
    templateFile: 'emailChange-zh-TW.html',
  },
  { templateId: '', name: 'qf-notices', templateFile: 'qf-notices-zh-CN.html' },
  { templateId: '', name: 'qf-notices', templateFile: 'qf-notices-zh-TW.html' },
  { templateId: '', name: 'qf-notices', templateFile: 'qf-notices-en.html' },
]

async function createDynamicTemplate(templateName) {
  const response = await fetch('https://api.sendgrid.com/v3/templates', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MATTERS_SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: templateName,
      generation: 'dynamic',
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Create template failed (${response.status}): ${errorBody}`)
  }

  const data = await response.json()

  return {
    templateId: data.id,
    raw: data,
  }
}

async function processTemplates(list) {
  for (const item of list) {
    if (!item.templateId) {
      const templateName = item.templateFile
      const { templateId } = await createDynamicTemplate(templateName)
      item.templateId = templateId

      console.log(`[CREATED] ${templateName} -> ${templateId}`)
    }
  }
  return list
}

;(async function main() {
  try {
    const result = await processTemplates(templates)

    console.log('\n===== FINAL RESULT =====')
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('Error creating templates:', error)
    process.exit(1)
  }
})()
