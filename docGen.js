const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const INPUT_FILE = path.join(__dirname, '/gotrue-doc/openref.yaml')
const OUTPUT_DIR = path.join(__dirname, '/gotrue/')

const main = () => {
  try {
    const spec = yaml.safeLoad(fs.readFileSync(INPUT_FILE, 'utf8'))
    const libraries = spec.info.libraries

    const pages = Object.entries(spec.pages).map(([pageName, data]) => {
      const slug = slugify(pageName)
      const examples = data['examples'] || []

      // Generate example tabs
      const exampleContent = examples
        .map((x) => {
          console.log('libraries', libraries)
          let allTabs = libraries
            .map((library) => {
              let content = x[library.id] || 'None'
              return Tab(library.id, content)
            })
            
            console.log('allTabs', allTabs)
          return Example(x.name, libraries, allTabs.join('\n'))
        })
        .join('\n')

      // Create page
      const content = Page({
        slug,
        id: slug,
        title: pageName,
        description: '',
        examples: exampleContent,
      })

      // Write to disk
      fs.writeFile(OUTPUT_DIR + `${slug}.mdx`, content, (err) => {
        if (err) return console.log(err)
        console.log('The file was saved!')
      })
    })
  } catch (e) {
    console.log(e)
  }
}

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[. )(]/g, '-') // Replace spaces and brackets -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

const Page = ({ id, title, slug, description = '', examples = '' }) =>
  `
---
id: ${id}
title: ${title}
slug: ${slug}
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

${description || ''}

${examples}
`.trim()

const Example = (name, libraries = [], examples = []) =>
  `
#### ${name}

<Tabs
  groupId="libraries"
  values={[${libraries.map((x) => `{ label: '${x.name}', value: '${x.id}' }`).toString()}]}>

${examples}

</Tabs>
`.trim()

const Tab = (library, exampleText) =>
  `
<TabItem value="${library}">

${exampleText}

</TabItem>
`.trim()

// Run everything
main()
