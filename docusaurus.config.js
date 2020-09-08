module.exports = {
  title: 'My Site',
  tagline: 'The tagline of my site',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
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
              label: 'GoTrue',
              to: 'gotrue/',
            },
            {
              label: 'PostREST',
              to: 'postgrest/',
            },
            // ... more items
          ],
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
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
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'gotrue', // for first plugin-content-docs with "resources/" path
        // homePageId: "doc2",
        path: './gotrue', // Path to data on filesystem, relative to site dir.
        routeBasePath: 'gotrue', // URL Route.
        include: ['**/*.md', '**/*.mdx'],
        sidebarPath: require.resolve('./sidebarsGoTrue.js'),
        // disableVersioning: true, // if not set with vesions, throw: Identifier 'React' has already been declared
      },
    ],
  ],
}
