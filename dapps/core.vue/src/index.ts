import Vue from 'vue';
import VueMaterial from 'material.vue';
import {
  getDomainName,
  lightwallet,
  utils,
} from 'dapp-browser';

import Main from './components/main.vue';

import {
  basePath,
  initializeRouting,
  router,
} from './routing';

export let finishedLogin;

export function startDApp(container: any, dbcpName: any) {
  if (container === document.body) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  initializeRouting(dbcpName);

  Vue.use(VueMaterial);
  let v = new Vue({
    el: container,
    router,
    render: h => h(Main),
  });
}