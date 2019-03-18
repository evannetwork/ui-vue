# ui-vue-core
This library includes the core libraries for the evan.network ui development using vue js. Within the dapps folder, you will find the `evancore.vue.libs` dapp, that includes evan specific vue implementations and is published under `@evan.network/ui-vue-core`.

All other dapps are constructed simply, to exclude the wanted library and map the correct original package name. E.g.: The vue-material library is published using the ens address `material.vue.libs.evan`. Within the DBCP of the using DApp, this lib is referenced within the dbcp.json as dependency. Within the application it self, `vue-material` can be imported normally using `import VueMaterial from 'vue-material'`. Within the webpack configuration, the vue-material import can be exported, to reduce the bundle size. 

Available libraries:

| original               | ens address        |
|------------------------|-:-:----------------|
| axios                  | axios.vue.libs     |
| vuex-i18n              | i18n.vuex.libs     |
| vue-recaptcha          | recaptcha.vue.libs |
| vue                    | vue.libs           |
| @evan.network/ui-vue-core | evancore.vue.libs      |
| vue-material           | material.vue.libs  |
| vue-router             | router.vue.libs    |
| vuex                   | vuex.libs          |

## Install
- use `yarn install` or `npm install`

## UI Development
- build and serve the local dapp serve
- starts an local server at http://localhost:3000/dev.html
```bash
npm run serve
```

- build all dapps
```bash
npm run dapps-build
```

- serve for file change tracking
```bash
npm run dapps-serve
```

- VueJS is optimized using the a production build, that is not only build by minification. Append the `--prod` configuration to achive this: `npm run dapps-build --prod` or `npm run dapps-serve --prod`.

## Deployment
Have a look at the [deployment description](https://evannetwork.github.io/dev/deployment).
