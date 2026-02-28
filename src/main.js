import { chunkData, getHeaders, transformData } from './helpers/data'
import { generateDoc } from './helpers/document'

document.querySelector('#csv').addEventListener('change', async (e) => {
  const headers = await getHeaders(e.target.files[0])
  // TODO: Allow the user to map headers to placeholders
})

document.querySelector('#form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const dataFile = document.querySelector('#csv').files[0]
  const numberOfItems = parseInt(document.querySelector('#numberOfItems').value, 10)
  const data = chunkData(await transformData(dataFile), numberOfItems)

  const templateFile = document.querySelector('#template').files[0]
  await generateDoc(templateFile, data)

  return false
})
