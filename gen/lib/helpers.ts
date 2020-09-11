
const fs = require('fs')

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[. )(]/g, '-') // Replace spaces and brackets -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export const tsDocCommentToMarkdown = (commentObject: { shortText?: string; text?: string }) =>
  `
${commentObject?.shortText || ''}

${commentObject?.text || ''}
`.trim()

export const writeToDisk = (fileName: string, content: any) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, (err) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
} 