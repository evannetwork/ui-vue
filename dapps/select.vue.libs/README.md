# evan.networtk library wrapper

DApp wrapper for: [axios](https://github.com/axios/axios)

## Build
```
npm run build
```


## Usage
- exclude `axios` from build job

- package.json
```
  ...
  "dependencies": {
    "axios": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "select.vue.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import axios from 'axios';
```
