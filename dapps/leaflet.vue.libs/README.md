# evan.networtk library wrapper

DApp wrapper for: [vue2-leaflet](https://github.com/KoRiGaN/Vue2Leaflet)

## Build
```
npm run build
```


## Usage
- exclude `vue2-leaflet` from build job

- package.json
```
  ...
  "dependencies": {
    "vue2-leaflet": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "leaflet.vue.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import leaflet from 'vue2-leaflet';
```
