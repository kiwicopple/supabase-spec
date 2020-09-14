module.exports = {
  title: 'Supabase',
  tagline: 'The open source Firebase alternative.',
  url: 'https://supabase.io',
  baseUrl: '/',
  favicon: '/favicon.ico',
  organizationName: 'supabase', // Usually your GitHub org/user name.
  projectName: 'supabase', // Usually your repo name.
  onBrokenLinks: 'warn',
  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      logo: {
        alt: 'Supabase',
        src: '/supabase-light.svg',
        srcDark: '/supabase-dark.svg',
      },
      items: [
        {
          href: 'https://github.com/facebook/docusaurus',
          className: 'navbar-item-github',
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'resources/',
          activeBasePath: 'resources',
          label: 'Reference',
          position: 'left',
          items: [
            {
              label: 'GoTrue Client',
              to: 'ref/gotrue',
            },
            {
              label: 'PostREST Client',
              to: 'ref/postgrest',
            },
            // ... more items
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    algolia: {
      apiKey: '766d56f13dd1e82f43253559b7c86636',
      indexName: 'supabase-docs',
    },
    colorMode: {
      // "light" | "dark"
      defaultMode: 'light',

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: false,

      // Should we use the prefers-color-scheme media-query,
      // using user system preferences, instead of the hardcoded defaultMode
      respectPrefersColorScheme: false,

      // Dark/light switch icon options
      switchConfig: {
        // Icon for the switch while in dark mode
        darkIcon: '  ',
        darkIconStyle: {
          marginTop: '1px',
        },
        lightIcon: '  ',
        lightIconStyle: {
          marginTop: '1px',
        },
      },
    },
    prism: {
      defaultLanguage: 'JavaScript',
      plugins: ['line-numbers', 'show-language'],
      theme: require('@kiwicopple/prism-react-renderer/themes/vsDark'),
      darkTheme: require('@kiwicopple/prism-react-renderer/themes/vsDark'),
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // id: "w1", // for first plugin-content-docs with "docs/" path, do not set this if you want versioning to work
          // homePageId: "doc1",
          sidebarPath: require.resolve('./sidebarsDocs.js'),
          // disableVersioning: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'gotrue', // for first plugin-content-docs with "resources/" path
        // homePageId: "doc2",
        path: './ref/gotrue', // Path to data on filesystem, relative to site dir.
        routeBasePath: 'ref/gotrue', // URL Route.
        include: ['**/*.md', '**/*.mdx'],
        sidebarPath: require.resolve('./sidebar_spec_gotrue.js'),
        // disableVersioning: true, // if not set with vesions, throw: Identifier 'React' has already been declared
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'postgrest', // for first plugin-content-docs with "resources/" path
        // homePageId: "doc2",
        path: './ref/postgrest', // Path to data on filesystem, relative to site dir.
        routeBasePath: 'ref/postgrest', // URL Route.
        include: ['**/*.md', '**/*.mdx'],
        sidebarPath: require.resolve('./sidebar_spec_postgrest.js'),
        // disableVersioning: true, // if not set with vesions, throw: Identifier 'React' has already been declared
      },
    ],
  ],
}
