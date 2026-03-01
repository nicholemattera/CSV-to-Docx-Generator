import Papa from 'papaparse'

// TODO: Remove this by allowing user's to specify the mapping.
const SD_66_MAP: Record<string, string> = {
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

async function blobToText(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      if (!event || !event.target) {
        return
      }

      resolve(event.target.result as string)
    }
    reader.readAsText(blob)
  })
}

export function chunkData(data: Array<Record<string, string>>, chunkSize: number) {
  const result = []
  for (let i = 0; i < data.length; i += chunkSize) {
    result.push(data.slice(i, i + chunkSize))
  }
  return result
}

export async function getHeaders(dataFile: File) {
  const dataFileText = await blobToText(dataFile)
  const headerLine = dataFileText.substring(0, dataFileText.indexOf('\n'))
  return (await Papa.parse(headerLine)).data[0]
}

export async function transformData(dataFile: File) {
  const result = await Papa.parse(await blobToText(dataFile), {
    header: true,
    skipEmptyLines: true,
  })
  const data = result.data as Array<Record<string, string>>

  return data.map((item) => {
    Object.keys(SD_66_MAP).forEach((csvKey) => {
      if (!item[csvKey] || !SD_66_MAP[csvKey]) {
        return
      }

      item[SD_66_MAP[csvKey]] = item[csvKey]
      delete item[csvKey]
    })

    return item
  })
}
