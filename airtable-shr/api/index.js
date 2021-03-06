const fetch = require('node-fetch')

module.exports = async (req, res) => {
  const url =
    req.query.url || 'https://airtable.com/shrlFq2jSymesUYW3/tblfPZxMSWxyUUpUY'
  if (!url) {
    return res.send('url param required')
  }
  if (!url.includes('airtable.com') || !url.includes('/shr')) {
    return res.send('invalid url')
  }
  try {
    return res.json(await scrapeURL(url))
  } catch (e) {
    console.error(e)
  }
  return res.json({ no: 'pe' })
}

async function scrapeURL(url) {
  const html = await fetch(url).then(r => r.text())
  const jsonStart = html.slice(html.indexOf('window.initData =') + 17)
  const json = jsonStart.slice(0, jsonStart.indexOf('};') + 1)
  const config = JSON.parse(json)
  const policy = JSON.parse(config.accessPolicy)
  return getTableData(
    config.sharedViewId,
    policy.applicationId,
    config.accessPolicy
  )
}

async function getTableData(viewId, applicationId, accessPolicy) {
  console.log(
    'vie',
    'https://airtable.com/v0.3/view/' +
      viewId +
      '/readSharedViewData?' +
      serialize({
        stringifiedObjectParams: {},
        requestId: 'reqrdddddwj83Mdd',
        accessPolicy: accessPolicy,
      })
  )
  const data = await fetch(
    'https://airtable.com/v0.3/view/' +
      viewId +
      '/readSharedViewData?' +
      serialize({
        stringifiedObjectParams: {},
        requestId: 'reqrdddddwj83Mdd',
        accessPolicy: accessPolicy,
      }),
    {
      credentials: 'include',
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language':
          'en,en-GB;q=0.9,nl;q=0.8,fr;q=0.7,af;q=0.6,la;q=0.5,de;q=0.4,mt;q=0.3',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-airtable-application-id': applicationId,
        'x-requested-with': 'XMLHttpRequest',
        'x-time-zone': 'Europe/Brussels',
        'x-user-locale': 'en',
      },
      referrerPolicy: 'no-referrer',
      body: null,
      method: 'GET',
      mode: 'cors',
    }
  ).then(r => r.json())
  console.log('data', data)
  return data
}

function serialize(obj) {
  const str = []
  for (const p in obj) {
    if (obj.hasOwnProperty(p) && obj[p]) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}
