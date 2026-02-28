import Papa from 'papaparse'

// TODO: Remove this by allowing user's to specify the mapping.
const SD_66_MAP = {
  'Delegate/Alternate Status': 'R',
  Precinct: 'P',
  'First Name': 'FN',
  'Last Name': 'LN',
  Address: 'A',
  City: 'C',
  State: 'S',
  Zip: 'Z',
  Email: 'E',
  'Phone Number': 'PN',
  'Type of Number': 'NT',
  'Preferred Language': 'PL',
}

async function blobToText(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      resolve(event.target.result)
    }
    reader.readAsText(blob)
  })
}

export function chunkData(data, chunkSize) {
  const result = []
  for (let i = 0; i < data.length; i += chunkSize) {
    result.push(data.slice(i, i + chunkSize))
  }
  return result
}

export async function getHeaders(dataFile) {
  const dataFileText = await blobToText(dataFile)
  const headerLine = dataFileText.substring(0, dataFileText.indexOf('\n'))
  return (await Papa.parse(headerLine)).data[0]
}

export async function transformData(dataFile) {
  const result = await Papa.parse(await blobToText(dataFile), {
    header: true,
  })

  return result.data
    .filter((rows) => rows.length !== 0)
    .map((item) => {
      Object.keys(SD_66_MAP).forEach((csvKey) => {
        item[SD_66_MAP[csvKey]] = item[csvKey]
        delete item[csvKey]
      })

      if (item['R'].startsWith('Alternate')) {
        item['RU'] = item['R']
        item['RB'] = ''
      } else {
        item['RU'] = ''
        item['RB'] = 'Delegate'
      }
      delete item['R']

      return item
    })
}
