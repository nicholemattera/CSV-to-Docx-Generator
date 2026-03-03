import { chunkData, getHeaders, transformData } from './helpers/data.ts'
import { generateDoc } from './helpers/document.ts'

const csvElement = document.querySelector<HTMLInputElement>('#csv')
const formElement = document.querySelector<HTMLFormElement>('#form')
const numberOfItemsElement = document.querySelector<HTMLInputElement>('#numberOfItems')
const templateElement = document.querySelector<HTMLInputElement>('#template')

if (!csvElement || !formElement || !numberOfItemsElement || !templateElement) {
  throw new Error('Elements unavailable on page')
}

csvElement.addEventListener('change', async () => {
  if (!csvElement.files || csvElement.files.length === 0) {
    return
  }

  const _ = await getHeaders(csvElement.files[0])
  // TODO: Allow the user to map headers to placeholders
})

formElement.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (
    !csvElement.files ||
    csvElement.files.length === 0 ||
    !numberOfItemsElement ||
    !templateElement.files ||
    templateElement.files.length === 0
  ) {
    return false
  }

  const dataFile = csvElement.files[0]
  const numberOfItems = parseInt(numberOfItemsElement.value, 10)
  const data = chunkData(await transformData(dataFile), numberOfItems)

  const templateFile = templateElement.files[0]
  await generateDoc(templateFile, data, numberOfItems)

  return false
})
