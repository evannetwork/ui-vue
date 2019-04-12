# evan.networtk library wrapper

DApp wrapper for: [vuex](https://github.com/vue/vuex)

## Build
```
npm run build
```


## Usage
- exclude `vuex` from build job

- package.json
```
  ...
  "dependencies": {
    "vuex": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "vuex.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import vuex from 'vuex';
```
