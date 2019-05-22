# ui-vue-core

## Next Version
### Features
- `evancore.vue.libs`
  - add `evan-tooltip` component
  - `evan-loading`
    - add className
  - Add `.vue` namespace to core vue dapps, so vue versions and angular versions exists side by side
  - adjust breadcrumb back button
  - `dapp-wrapper`
    - add `content-header` slot
  - `breadcrumbs`
    - `attachToDAppWrapper` param to host breadcrumbs add to level over `dapp-wrapper-sidebar-2`
    - add `ignored` array to remove blank path's from breadcrumbs
  - add `under-development` component
  - add `nav-tabs` component

### Fixes
### Deprecations


## Version 1.1.0
### Features
- show warning icons on dispatcher errors
- add `recovery url` mechanism
- `evan-file` component
- Add modal Prop maxWidth prop
- add html id selectors to `dapp-wrapper`, `file-input`, `evan-modal`

### Fixes
- use material icons for vue dapps
- do not use contract address for dapp routings
- fix dapp-loader getNextDApp clear previous container
- allow empty content for dapp-wrapper-level-2
- fix routing redirect path fil…
- fix mutation observer for vue instance destroy
- Add vuex.i18n fallback language
- add decodeURIComponent to breadcrumb titles


## Version 1.0.0
### Features
- initial version
- add vue dependency libraries
- add `evancore.vue.libs` library to handle vue dapp creation
