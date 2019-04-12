# evan.networtk library wrapper

DApp wrapper for: [vuex-i18n](https://github.com/kazupon/vue-i18n)

## Build
```
npm run build
```


## Usage
- exclude `vuex-i18n` from build job

- package.json
```
  ...
  "dependencies": {
    "vuex-i18n": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "i18n.vuex.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import i18n from 'vuex-i18n';
```
