import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

function downloadBlob(blob: Blob, filename: string) {
  const anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(blob)
  anchor.download = filename
  anchor.click()
}

function getFileName(index: number) {
  return `document-${index + 1}.docx`
}

export async function generateDoc(templateFile: File, data: Array<Array<Record<string, string>>>, chunkSize: number) {
  const result = new PizZip()


  for (let index = 0; index < data.length; index++) {
    // Flatten the CSV data into an object to be passed in to the templater
    const dataChunk = data[index].reduce<Record<string, string>>((result, item, index) => {
      Object.keys(item).forEach((key) => {
        result[`${index}:${key}`] = item[key]
      })

      return result
    }, {})

    // Fill in blank data for any remaining items
    if (data[index].length < chunkSize) {
      for (let y = data[index].length; y < chunkSize; y++) {
        Object.keys(data[index][0]).forEach((key) => {
          dataChunk[`${y}:${key}`] = ''
        })
      }
    }

    const zip = new PizZip(await templateFile.arrayBuffer())
    const doc = new Docxtemplater(zip, {
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
