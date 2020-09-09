/**
 * Usage:
 *    ts-node docGen.ts -o {output_dir} {input}.yml
 */

import Sidebar from './gen/components/Sidebar'
import SidebarCategory from './gen/components/SidebarCategory'
import Tab from './gen/components/Tab'
import Tabs from './gen/components/Tabs'
import { slugify, tsCommentToMarkdown } from './gen/lib/helpers'

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const tsspec = path.join(__dirname, '/spec/_tsspec.json')
const definitions = JSON.parse(fs.readFileSync(tsspec, 'utf8'))
const modules = definitions.children.map((x) => x.children[0])

const main = (fileNames, options) => {
  try {
    const outputDir = options.o || options.output || ''
    fileNames.forEach((inputFileName) => {
      gen(inputFileName, outputDir)
    })
    return
  } catch (e) {
    console.log(e)
  }
}

// Do the hard work
function gen(inputFileName, outputDir) {
  const spec = yaml.safeLoad(fs.readFileSync(inputFileName, 'utf8'))
  const definition = modules.find((x) => JSON.parse(x.originalName) == spec.info.definition)
  const libraries = spec.info.libraries
  const pages = Object.entries(spec.pages)

  // Sidebar
  const sidebarFileName = inputFileName.replace('/', '_').replace('.yml', '')
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
  pages.map(([pageName, data]: [string, { description?: string }]) => {
    const slug = slugify(pageName)
    const definitionRef = data['$ref'] || null
    const def = !definitionRef ? {} : definition.children.find((x) => x.name == definitionRef) || {}
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

    const spotlight = examples.find((x) => x.isSpotlight) || null
    const spotlightContent = !spotlight
      ? ''
      : Tabs(
          libraries,
          libraries
            .map((library) => {
              let content = spotlight[library.id] || 'None'
              return Tab(library.id, content)
            })
            .join('\n')
        )

    // Create page
    const description = data.description || tsCommentToMarkdown(def.comment)
    const content = Page({
      slug,
      id: slug,
      title: pageName,
      spotlight: spotlightContent,
      description: data.description || tsCommentToMarkdown(def.comment),
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

const Page = ({ id, title, slug, description = '', examples = '', spotlight = '' }) =>
  `
---
id: ${id}
title: ${title}
slug: ${slug}
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

${description}

${spotlight}

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

// Run everything
const argv = require('minimist')(process.argv.slice(2))
main(argv['_'], argv)
