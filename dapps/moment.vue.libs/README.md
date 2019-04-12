# evan.networtk library wrapper

DApp wrapper for: [vue-moment](https://github.com/brockpetrie/vue-moment)

## Build
```
npm run build
```


## Usage
- exclude `vue-moment` from build job

- package.json
```
  ...
  "dependencies": {
    "vue-moment": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "moment.vue.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import vue-moment from 'vue-moment';
```
