# evan.networtk library wrapper

DApp wrapper for: [vue-router](https://router.vuejs.org/)




## Build
```
npm run build
```


## Usage
- exclude `vue-router` from build job

- package.json
```
  ...
  "dependencies": {
    "vue-router": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "router.vue.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import vue-router from 'vue-router';
```
