/**
 * Usage:
 *    ts-node docGen.ts -o {output_dir} {input}.yml
 */

import Example from './gen/components/Example'
import Page from './gen/components/Page'
import Sidebar from './gen/components/Sidebar'
import SidebarCategory from './gen/components/SidebarCategory'
import Tab from './gen/components/Tab'
import Tabs from './gen/components/Tabs'
import { slugify, tsDocCommentToMdComment, writeToDisk } from './gen/lib/helpers'
import { TsDoc, OpenRef } from './gen/definitions'

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

async function gen(inputFileName, outputDir) {
  const docSpec = yaml.safeLoad(fs.readFileSync(inputFileName, 'utf8'))
  const definition = modules.find((x) => JSON.parse(x.originalName) == docSpec.info.definition)
  const allLanguages = docSpec.info.libraries
  const pages = Object.entries(docSpec.pages).map(([name, x]: [string, OpenRef.Page]) => ({
    ...x,
    pageName: name,
  }))

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
  pages.forEach(async (pageSpec: OpenRef.Page) => {
    try {
      const slug = slugify(pageSpec.pageName)
      const hasTsRef = pageSpec['$ref'] || null
      const tsDefinition = hasTsRef && extractTsDocNode(hasTsRef, definition)
      if (hasTsRef && !tsDefinition) throw new Error('Definition not found: ' + hasTsRef)

      const functionDeclaration = tsDefinition?.type?.declaration
      const paramsComments: TsDoc.CommentTag = tsDefinition.comment?.tags?.filter(x => x.tag == 'param')
      const paramDefinitions: TsDoc.TypeDefinition[] = functionDeclaration.signatures[0].parameters // PMC: seems flaky.. why the [0]?
      let parameters = `<ul>${paramDefinitions.map((x) => recurseThroughParams(x)).join(`\n`)}</ul>`

      // Create page
      const content = Page({
        slug,
        id: slug,
        title: pageSpec.pageName,
        description: pageSpec.description || tsDocCommentToMdComment(tsDefinition.comment),
        parameters,
        spotlight: generateSpotlight(pageSpec['examples'] || [], allLanguages),
        examples: generateExamples(pageSpec['examples'] || [], allLanguages),
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

function recurseThroughParams(paramDefinition: TsDoc.TypeDefinition) {
  let children = paramDefinition.type?.declaration?.children
  let subContent =
    !!children && `\n<ul>${children.map((x) => recurseThroughParams(x)).join('\n')}</ul>`
  return `\n\<li>\n${paramDefinition.name} ${subContent ? subContent : ''}\n</li>\n`
}

function generateExamples(specExamples: any, allLanguages: any) {
  return specExamples.map((example) => {
    let allTabs = Tabs(allLanguages, generateTabs(allLanguages, example))
    return Example({ name: example.name, tabs: allTabs })
  })
}

/**
 * A spotlight is an example which appears at the top of the page.
 */
function generateSpotlight(specExamples: any, allLanguages: any) {
  const spotlight = specExamples.find((x) => x.isSpotlight) || null
  const spotlightContent = !spotlight
    ? ''
    : Tabs(allLanguages, generateTabs(allLanguages, spotlight))
  return spotlightContent
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
