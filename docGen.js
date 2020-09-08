const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

/**
 * node docGen -o {output_dir} {input}.yml
 * node docGen -o ref/gotrue spec/gotrue.yml
 * node docGen -o ref/postgrest spec/postgrest.yml
 */

const main = (fileNames, options) => {
  try {
    const outputDir = options.o || options.output || ''

    fileNames.forEach((inputFileName) => {
      gen(inputFileName)
    })
    return

    function gen(inputFileName) {
      const spec = yaml.safeLoad(fs.readFileSync(inputFileName, 'utf8'))
      const libraries = spec.info.libraries
      const pages = Object.entries(spec.pages)

      // Sidebar
      const sidebarFileName = inputFileName.replace('/', '_').replace('.yml', '')
      console.log('sidebarFileName', sidebarFileName)
      const categories = spec.info.docs.sidebar.map((x) => {
        const items = x.items.map((item) => `'${slugify(item)}'`)
        return SidebarCategory(x.name, items)
      })
      fs.writeFile(`./sidebar_${sidebarFileName}.js`, Sidebar(categories), (err) => {
        if (err) return console.log(err)
        console.log('The sidebar was saved!')
      })

      // Index Page
      const index = Page({
        slug: '/',
        id: 'index',
        title: spec.info.title,
        description: spec.info.description,
      })
      fs.writeFile(outputDir + `/index.mdx`, index, (err) => {
        if (err) return console.log(err)
        console.log('The index was saved!')
      })

      // Pages
      pages.map(([pageName, data]) => {
        const slug = slugify(pageName)
        const examples = data['examples'] || []

        // Generate example tabs
        const exampleContent = examples
          .map((x) => {
            let allTabs = libraries.map((library) => {
              let content = x[library.id] || 'None'
              return Tab(library.id, content)
            })
            return Example(x.name, libraries, allTabs.join('\n'))
          })
          .join('\n')


        const callout = examples.find((x) => x.isCallout) || null
        const calloutContent = !callout
          ? ''
          : Tabs(
              libraries,
              libraries
                .map((library) => {
                  let content = callout[library.id] || 'None'
                  return Tab(library.id, content)
                })
                .join('\n')
            )
          console.log('calloutContent', calloutContent)

        // Create page
        const content = Page({
          slug,
          id: slug,
          title: pageName,
          callout: calloutContent,
          description: data.description || '',
          examples: exampleContent,
        })

        // Write to disk
        const dest = outputDir + `/${slug}.mdx`
        fs.writeFile(dest, content, (err) => {
          if (err) return console.log(err)
          console.log('Saved: ' + dest)
        })
      })
    }
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

const Page = ({ id, title, slug, description = '', examples = '', callout = '' }) =>
  `
---
id: ${id}
title: ${title}
slug: ${slug}
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

${description}

${callout}

## Parameters

Some auto gen'd params

## Result

Some auto gen'd result

## Errors

Some auto gen'd errors

${examples ? '## Examples' : ''}
${examples}
`.trim()

const Example = (name, libraries = [], examples = []) =>
  `
### ${name}

${Tabs(libraries, examples)}
`.trim()

const Tabs = (libraries = [], examples = []) =>
  `
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

const Sidebar = (categories) =>
  `
module.exports = {
  docs: [
    ${categories.map((x) => x).join(',\n    ')}
  ],
}
`.trim()

const SidebarCategory = (name, items) =>
  `{
      type: 'category',
      label: '${name}',
      items: [${items.join(', ')}],
      collapsed: false,
    }`

// Run everything
const argv = require('minimist')(process.argv.slice(2))
main(argv['_'], argv)
