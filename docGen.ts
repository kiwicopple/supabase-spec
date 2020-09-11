/**
 * Usage:
 *    ts-node docGen.ts -o {output_dir} {input}.yml
 */

import Sidebar from './gen/components/Sidebar'
import SidebarCategory from './gen/components/SidebarCategory'
import Tab from './gen/components/Tab'
import Tabs from './gen/components/Tabs'
import { slugify, tsDocCommentToMarkdown, writeToDisk } from './gen/lib/helpers'

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

// Do the hard work
async function gen(inputFileName, outputDir) {
  const docSpec = yaml.safeLoad(fs.readFileSync(inputFileName, 'utf8'))
  const definition = modules.find((x) => JSON.parse(x.originalName) == docSpec.info.definition)
  const allLanguages = docSpec.info.libraries
  const pages = Object.entries(docSpec.pages)

  // Sidebar
  const inputFileNameToSnakeCase = inputFileName.replace('/', '_').replace('.yml', '')
  const sidebarFileName = `sidebar_${inputFileNameToSnakeCase}.js`
  const sidebar = generateSidebar(docSpec)
  await writeToDisk(sidebarFileName, sidebar)
  console.log('Sidebar created: ', sidebarFileName)

  // Index Page
  const indexFilename = outputDir + `/index.mdx`
  const index = generateDocsIndexPage(docSpec)
  await writeToDisk(indexFilename, index)
  console.log('The index was saved: ', indexFilename)

  // Generate Pages
  pages.forEach(async ([pageName, data]: [string, { description?: string }]) => {
    try {
      const slug = slugify(pageName)
      const hasTsReference = data['$ref'] || null
      const tsDefinition = hasTsReference && extractTsDocNode(hasTsReference, definition)
      if (hasTsReference && !tsDefinition) throw new Error('Definition not found: ' + hasTsReference)

      // console.log('tsDefinition', tsDefinition)

      // Generate example tabs
      const examples = data['examples'] || []
      const exampleContent = examples
        .map((example) => {
          let allTabs = generateTabs(allLanguages, example)
          return Example(example.name, allLanguages, allTabs)
        })
        .join('\n')

      const spotlight = examples.find((x) => x.isSpotlight) || null
      const spotlightContent = !spotlight
        ? ''
        : Tabs(allLanguages, generateTabs(allLanguages, spotlight))

      // Create page
      const content = Page({
        slug,
        id: slug,
        title: pageName,
        spotlight: spotlightContent,
        description: data.description || tsDocCommentToMarkdown(tsDefinition.comment),
        examples: exampleContent,
      })

      // Write to disk
      const dest = outputDir + `/${slug}.mdx`
      await writeToDisk(dest, content)
      console.log('Saved: ', dest)
    } catch (error) {
      console.error(error)
    }
  })
}


function generateTabs(allLanguages: any, example: any) {
  return allLanguages
    .map((library) => {
      let content = example[library.id] || 'None'
      return Tab(library.id, content)
    })
    .join('\n')
}

/**
 * Iterates through the definition to find the correct definition.
 * You can pass it a deeply nested node using dot notation. eg: 'LoggedInUser.data.email'
 */
function extractTsDocNode(nodeToFind: string, definition: any) {
  const nodeTree = nodeToFind.split('.')
  let i = 0
  let currentNode = null
  while (i < nodeTree.length) {
    currentNode = definition.children.find((x) => x.name == nodeTree[i]) || null
    if (currentNode == null) break 
    i++
  }
  return currentNode
}

function generateSidebar(docSpec: any) {
  let categories = docSpec.info.docs.sidebar.map((x) => {
    const items = x.items.map((item) => `'${slugify(item)}'`)
    return SidebarCategory(x.name, items)
  })
  return Sidebar(categories)
}

function generateDocsIndexPage(docSpec: any) {
  return Page({
    slug: '/',
    id: 'index',
    title: docSpec.info.title,
    description: docSpec.info.description,
  })
}


// Run everything
const argv = require('minimist')(process.argv.slice(2))
main(argv['_'], argv)
