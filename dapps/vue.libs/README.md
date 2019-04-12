# evan.networtk library wrapper

DApp wrapper for: [vue](https://github.com/vuejs/vue)

## Build
```
npm run build
```


## Usage
- exclude `vue` from build job

- package.json
```
  ...
  "dependencies": {
    "vue": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "vue.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import vue from 'vue';
```
