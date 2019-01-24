import Vue from "vue";
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import HelloComponent from "./components/hello.vue";

import {
  getDomainName,
} from 'dapp-browser';

export let router: any;
export let basePath: any;

export function initializeRouting(dbcpName: string) {
  // initialize routing structure
  const baseDAppName = `${ dbcpName }.${ getDomainName() }`;
  const beforePath = window.location.hash.split(baseDAppName)[0];
  basePath = (beforePath + baseDAppName).replace('#', '');
  router = new VueRouter({
    base: basePath,
    routes: [
      { path: `${ basePath }`, name: 'helloworld', component: HelloComponent },
    ]
  })
  router.push({ path: `${ basePath }` });
}