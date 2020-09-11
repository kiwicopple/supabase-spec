type PageParmas = {
  id: string
  title: string
  slug: string
  description?: string
  parameters?: string
  examples?: string[]
  spotlight?: string
}

const Page = ({
  id,
  title,
  slug,
  description = '',
  parameters= '',
  examples = [],
  spotlight = '',
}: PageParmas) =>
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

${parameters}

## Result

Some auto gen'd result

## Errors

Some auto gen'd errors

${examples ? '## Examples' : ''}

${examples.join(`\n\n`)}

`.trim()

export default Page