# evan.networtk library wrapper

DApp wrapper for: [vue-recaptcha](https://github.com/DanSnow/vue-recaptcha)

## Build
```
npm run build
```


## Usage
- exclude `vue-recaptcha` from build job

- package.json
```
  ...
  "dependencies": {
    "vue-recaptcha": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "recaptcha.vue.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import vue-recaptcha from 'vue-recaptcha';
```
