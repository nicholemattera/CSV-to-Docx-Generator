import Papa from 'papaparse'

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
    return item
  })
}
