module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Getting started',
      items: ['index', 'installing', 'createclient'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'General functions',
      items: ['signup', 'login', 'forgotpassword', 'jwt'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'User functions',
      items: ['user', 'user-data', 'user-logout'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Hooks/callbacks',
      items: ['onauthstatechange'],
      collapsed: false,
    }
  ],
}