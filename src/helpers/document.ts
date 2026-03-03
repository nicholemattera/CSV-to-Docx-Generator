import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

function downloadBlob(blob: Blob, filename: string) {
  const anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(blob)
  anchor.download = filename
  anchor.click()

  URL.revokeObjectURL(anchor.href)
}

function getFileName(index: number) {
  return `document-${index + 1}.docx`
}

export async function generateDoc(templateFile: File, data: Array<Array<Record<string, string>>>, chunkSize: number) {
  const templateBuffer = await templateFile.arrayBuffer()
  const result = new PizZip()

  for (let index = 0; index < data.length; index++) {
    const dataKeys = Object.keys(data[0][0])

    // Flatten the CSV data into an object to be passed in to the templater
    const dataChunk = data[index].reduce<Record<string, string>>((result, item, index) => {
      dataKeys.forEach((key) => {
        result[`${index}:${key}`] = item[key]
      })

      return result
    }, {})

    // Fill in blank data for any remaining items
    for (let y = data[index].length; y < chunkSize; y++) {
      dataKeys.forEach((key) => {
        dataChunk[`${y}:${key}`] = ''
      })
    }

    const doc = new Docxtemplater(new PizZip(templateBuffer), {
      paragraphLoop: true,
      linebreaks: true,
    })
    doc.render(dataChunk)

    // Add the doc file to the resulting zip file
    result.file(getFileName(index), await doc.toBlob().arrayBuffer())
  }

  // Download the resulting zip file
  downloadBlob(result.generate({ type: 'blob' }), `documents-${new Date().getTime()}.zip`)
}
