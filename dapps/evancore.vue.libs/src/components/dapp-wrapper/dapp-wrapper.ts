/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/
// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanQueue, Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { DAppWrapperRouteInterface } from '../../interfaces';
import { registerEvanI18N, } from '../../vue-core';
import { getDomainName } from '../../utils';

// load domain name for quick usage
const domainName = getDomainName();
const i18nPref = '_evan._routes';

@Component({ })
export default class DAppWrapper  extends mixins(EvanComponent) {
  /**
   * url to img for large sidebar (default is set in the create function using $store)
   */
  @Prop({
    default: function() {
      return (<any>this).$store.state.uiLibBaseUrl + '/assets/evan-logo-dark-half.svg';
    }
  }) brandLarge: string;

  /**
   * url to img for large sidebar (default is set in the create function using $store)
   */
  @Prop({
    default: function() {
      return (<any>this).$store.state.uiLibBaseUrl + '/assets/evan-logo-small.svg';
    }
  }) brandSmall: string;

  /**
   * routes that should be displayed in the sidepanel, if no sidebar slot is given
   * format: [
   *    {
   *      name: 'favorites.evan',
   *      icon: 'mdi mdi-bookmark',
   *      title: '_dashboard.routes.favorites'
   *    }
   *  ]
   */
  @Prop({
    type: Array,
    default: function(options) {
      return [
        { title: `${ i18nPref }.digitaltwins`, path: `digitaltwins.${ domainName }`, icon: 'mdi mdi-fingerprint' },
        { title: `${ i18nPref }.favorites`, path: `favorites.vue.${ domainName }`, icon: 'mdi mdi-bookmark-outline' },
        // { title: `${ i18nPref }.mailbox`, path: `mailbox.vue.${ domainName }`, icon: 'mdi mdi-email' },
        { title: `${ i18nPref }.contacts`, path: `addressbook.vue.${ domainName }`, icon: 'mdi mdi-account-group-outline' },
        // { title: `${ i18nPref }.profile`, path: `profile.vue.${ domainName }`, icon: 'mdi mdi-account' },
      ];
    }
  }) routes: Array<DAppWrapperRouteInterface>;

  /**
   * organized like the normal routes, but displayed smaller on the bottom of the nav
   */
  @Prop({
    type: Array,
  }) bottomRoutes: Array<DAppWrapperRouteInterface>;


  /**
   * base url of the vue component that uses the dapp-wrapper (e.g.: dashboard.evan)
   */
  @Prop({
    default: function() {
      return (<any>this).$store.state.dapp.baseHash;
    }
  }) routeBaseHash: string;

  /**
   * should be the runtime created? Includes onboarding & login checks.
   */
  @Prop({ default: true }) createRuntime: any;

  /**
   * id of this element, so child elements can be queried easier
   */
  id = `dappwrapper_${ Date.now() + Math.round(Math.random() * 1000000) }`;
  sideBar2Selector = `#${ this.id } .dapp-wrapper-content-wrapper > .dapp-wrapper-sidebar-2 > *`

  /**
   * is the current dapp-wrapper gets initialized? => use loading to don't render dapp-loader or
   * something quickly and directly after this remove the content and show the login or onboarding
   */
  loading = true;

  /**
   * is the small toolbar shown on large devices?
   */
  smallToolbar: boolean = window.localStorage['evan-small-toolbar'] ? true : false;

  /**
   * Is the sidebar enabled and should be shown? Per defaul enabled, but when no routes are defined
   * or the user is within an onboarding or login process, it will be true.
   */
  enableSidebar = true;

  /**
   * Enables the nav bar icons including mailbox, synchronisation, .... Will be disabled uring login
   * or onboarding process.
   */
  enableNav = true;

  /**
   * show sidebar on small / medium devices?
   */
  showSideBar = false;

  /**
   * show second level navigation on small devices?
   */
  showSideBar2 = true;

  /**
   * login function that was applied by the setPasswordFunction
   */
  login: Function|boolean = false;

  /**
   * onboarding dapp is opened, so the user isn't logged in
   */
  onboarding: Function|boolean = false;

  /**
   * Watch for hash updates when the user is on the onboarding screen. Wait for the user to finished
   * the process.
   */
  hashChangeWatcher: any;

  /**
   * current user informations
   */
  userInfo: any = {
    addressBook: { },
    alias: '',
    loading: false,
    mails: '',
    mailsLoading: false,
    newMailCount: 0,
    readMails: [ ],
    totalMails: 0,
  };

  /**
   * Queue loading informations
   */
  queueInstances = { };
  queueCount = 0;
  queueErrorCount = 0;
  queueLoading = false;
  queueWatcher = null;

  /**
   * Show a modal for delete / accepting an dispatcher instance
   */
  instanceInteraction: any = undefined;

  /**
   * Set interval to reload mails each 30 seconds
   */
  mailsWatcher: any;

  /**
   * Watch for sidebar close events, so it can be closed from outside
   */
  sideBarCloseWatcher: any;

  /**
   * Core routes that will be displayed in the top right user dropdown
   */
  coreRoutes = [
    { title: `favorites`, path: `favorites.vue.${ domainName }`, icon: 'mdi mdi-bookmark' },
    { title: `mailbox`, path: `mailbox.vue.${ domainName }`, icon: 'mdi mdi-email' },
    { seperator: true },
    { title: `contacts`, path: `addressbook.vue.${ domainName }`, icon: 'mdi mdi-book-multiple' },
  ];

  /**
   * Returns the i18n title key for the active route.
   *
   * @return     {string}  active route i18n or route path
   */
  get activeRouteTitle(): string {
    if (this.routes) {
      const allRoutes = (<any>[ ]).concat(this.routes, this.bottomRoutes || [ ]);

      for (let i = 0; i < allRoutes.length; i++) {
        if (this.$route.path.startsWith(<string>allRoutes[i].fullPath)) {
          return allRoutes[i].title;
        }
      }
    }

    return this.$route.path;
  }

  /**
   * Toggles the toolbar large and small on big screens, on medium screens show hide the toolbar, on
   * small screens, show / hide both toolbars.
   */
  toggleSmallToolbar() {
    if (window.innerWidth < 992) {
      this.showSideBar = !this.showSideBar;

      // if sidebar 2 is used, show it directly
      if (document.querySelectorAll(this.sideBar2Selector).length !== 0) {
        this.showSideBar2 = true;
      } else {
        this.showSideBar2 = false;
      }
    } else {
      this.smallToolbar = !this.smallToolbar;

      // set or clear the localStorage variable
      if (this.smallToolbar) {
        window.localStorage['evan-small-toolbar'] = true;
      } else {
        delete window.localStorage['evan-small-toolbar'];
      }
    }
  }

  /**
   * Triggered when the a root sidebar navigation was clicked. If the route already activated, show
   * the second level navigation.
   *
   * @param      {DAppWrapperRouteInterface}  route   route that was activated
   */
  routeActivated(route: DAppWrapperRouteInterface) {
    // if the same route was opened, the second navigation should be displayed
    if (this.$route.path.startsWith(<string>route.fullPath) &&
        document.querySelectorAll(this.sideBar2Selector).length !== 0) {
      this.showSideBar2 = true;
    } else {
      this.showSideBar = false;
    }

    // (<any>this).evanNavigate(route.path);
  }

  /**
   * Initialize the core runtime for the evan network.
   */
  async created(): Promise<any> {
    // disable sidebar, when no routes are defined
    if (!this.routes || this.routes.length === 0) {
      this.enableSidebar = false;
    } else {
      // else map full path to check active route states and translations
      (<any>[ ]).concat(this.routes, this.bottomRoutes || [ ])
        .forEach((route) => route.fullPath = `${ (<any>this).dapp.baseHash }/${ route.path }`);
    }

    // if the runtime should be created, start it up
    if (this.createRuntime) {
      await this.handleLoginOnboarding();
    } else {
      this.loading = false;
    }

    this.sideBarCloseWatcher = ($event: CustomEvent) => this.showSideBar = false;
    window.addEventListener('dapp-wrapper-sidebar-close', this.sideBarCloseWatcher);
  }


  /**
   * Clear the hash change watcher
   */
  async beforeDestroy() {
    // only remove the hashChangeWatcher, when it was already bind (user was on the onboarding)
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
    // clear mails watcher
    this.mailsWatcher && window.clearInterval(this.mailsWatcher);
    // clear queue watcher
    this.userInfo && this.queueWatcher && this.queueWatcher();
    // return the watch remove function
    this.sideBarCloseWatcher && window.removeEventListener(`evan-queue-${ this.id }`,
      this.sideBarCloseWatcher);
  }

  /**
   * Check for parent dapp-wrapper elements and disable nav / sidebar if needed
   */
  async mounted() {
    let parent: any = this.$el;

    // search until body or an wrapper body is reached, if an parent dapp-wrapper is found, hide nav
    // and sidebar for this dapp-wrapper
    do {
      parent = parent.parentElement;
      if (parent && parent !== this.$el && parent.className.indexOf('dapp-wrapper-body') !== -1) {
        this.enableNav = false;
        this.enableSidebar = false;

        break;
      }
    } while (parent && parent !== document.body);
  }

  /**
   * If a runtime should be created, ensure that the user is logged in / onboarded and create
   * runtimes
   */
  async handleLoginOnboarding() {
    // check for logged in account and if its onboarded
    const activeAccount = dappBrowser.core.activeAccount();
    let loggedIn = false;
    let isOnboarded = false;

    // check if a user is already logged in, if yes, navigate to the signed in route
    if (activeAccount && window.localStorage['evan-vault']) {
      loggedIn = true;

      try {
        isOnboarded = await dappBrowser.bccHelper.isAccountOnboarded(activeAccount);
      } catch (ex) { }
    }

    if (!isOnboarded || !loggedIn) {
      this.loading = false;
      this.onboarding = true;

      // if the watcher was already bound, remove it!
      if (this.hashChangeWatcher) {
         window.removeEventListener('hashchange', this.hashChangeWatcher);
      }

      // set the hash change watcher, so we can check that the user finished the onboarding process
      const dappLoader = this;
      this.hashChangeWatcher = function() {
        if (window.location.hash.indexOf(`onboarding.vue.${ (<any>this).domainName }`) === -1) {
          // recheck login and onboarding
          dappLoader.handleLoginOnboarding();
        }
      };

      // add the hash change listener
      window.addEventListener('hashchange', this.hashChangeWatcher);

      if (this.$route.path.indexOf(`/onboarding.vue.${ (<any>this).domainName }`) === -1) {
        // navigate to the onboarding and apply the current hash as origin, so the onboarding can
        // navigate back their
        this.$router.push({
          path: `${ (<any>this).dapp.baseHash }/onboarding.vue.${ (<any>this).domainName }`,
          query: {
            origin: this.$route.path,
            ...this.$route.query,
          }
        });
      }

      return;
    } else {
      this.onboarding = false;

      // set the password function
      dappBrowser.lightwallet.setPasswordFunction(async () =>
        // set resolve password
        await new Promise((resolve) => {
          this.loading = false;
          this.login = (password: string) => resolve(password);
        })
      );

      // unlock the profile directly
      const vault = await dappBrowser.lightwallet.loadUnlockedVault();

      // setup runtime and save it to the axios store
      this.$store.state.runtime = await dappBrowser.bccHelper.createDefaultRuntime(
        bcc,
        activeAccount,
        vault.encryptionKey,
        dappBrowser.lightwallet.getPrivateKey(vault, activeAccount)
      );

      // send logged in event
      this.$emit('loggedin', this.$store.state.runtime);
      this.loading = false;
      this.login = false;

      // load the user infos like alias, mails, dispatchers ...
      if (this.enableNav) {
        this.loadUserSpecific();
      }
    }
  }

  /**
   * Load the users specific data.
   */
  async loadUserSpecific() {
    this.userInfo.loading = true;
    this.userInfo.address = dappBrowser.core.activeAccount();

    // load alias from addressbook
    this.userInfo.addressBook = await this.$store.state.runtime.profile.getAddressBook();
    this.userInfo.alias = this.userInfo.addressBook.profile[dappBrowser.core.activeAccount()].alias;

    // setup dispatcher data saving logic
    this.setupQueue();

    // load mail information and initialize and mail watcher
    this.loadMails();
    this.mailsWatcher = setInterval(() => this.loadMails(), 5 * 1000);

    this.userInfo.loading = false;
  }

  /**
   * Load the mail informations for the current user
   */
  async loadMails(mailsToReach = 5) {
    if (!this.userInfo.mailsLoading) {
      this.userInfo.mailsLoading = true;

      try {
        // load mail inbox informations, load 10 for checking for +9 new mails
        this.userInfo.readMails = JSON.parse(window.localStorage['evan-mail-read'] || '[ ]');
        this.userInfo.newMailCount = 0;

        let mails = [ ];
        let offset = 0;
        let initial = true;
        this.userInfo.totalMails = 0;

        // load until 5 mails could be decrypted or the maximum amount of mails is reached
        while (mails.length < 5 && (initial || offset < this.userInfo.totalMails)) {
          const mailResult = await this.$store.state.runtime.mailbox.getReceivedMails(5, offset);

          // increase offset with amount of loaded mails
          initial = false;
          offset = offset + Object.keys(mailResult.mails).length;

          // update the total mail count
          this.userInfo.totalMails = mailResult.totalResultCount;

          // map all the mails in to an mail array and show only 5
          mails = mails.concat(Object.keys(mailResult.mails)
            .map((mailAddress: string) => {
              if (mailResult.mails[mailAddress] && mailResult.mails[mailAddress].content) {
                const mail = mailResult.mails[mailAddress].content;
                mail.address = mailAddress;

                return mail;
              }
            })
            .filter(mail => !!mail)
          );
        }

        // show a maximum of 5 mails
        this.userInfo.mails = mails.slice(0, 5);

        // check the last read mail count against the current one, to check for new mails
        const previousRead = parseInt(window.localStorage['evan-mail-read-count'] || 0, 10);
        if (previousRead < this.userInfo.totalMails) {
          this.userInfo.newMailCount = this.userInfo.totalMails - previousRead;
        }
      } catch (ex) {
        this.$store.state.runtime.logger.log(ex.message, 'error');
      }

      this.userInfo.mailsLoading = false;
    }
  }

  /**
   * Opens the mail preview dropdown and sets the evan-mail-read-count.
   */
  openMailDropdown() {
    (<any>this.$refs.mailDropdown).show();

    // set last mail read count to the current counter
    this.userInfo.newMailCount = 0;
    window.localStorage['evan-mail-read-count'] = this.userInfo.totalMails;
  }

  /**
   * Opens a mail within the mailbox
   */
  openMail(mail: any, $event: any) {
    // set the mail read and save it into the local store
    if (this.userInfo.readMails.indexOf(mail.address) === -1) {
      this.userInfo.readMails.push(mail.address);

      window.localStorage['evan-mail-read'] = JSON.stringify(this.userInfo.readMails)
    }

    (<any>this.$refs).mailDropdown.hide($event);
  }

  /**
   * Load the queue data
   */
  async setupQueue() {
    this.queueLoading = true;

    // load queue for the current account and load the queue entries
    const runtime = this.$store.state.runtime;
    const queue = await new EvanQueue(this.$store.state.runtime.activeAccount);
    const dispatchers = await queue.load('*');

    // load all dispatcher instances for this user
    await Promise.all(dispatchers.map(async (dispatcherObj: any) => {
      try {
        const [ dappEns, dispatcherName ] = dispatcherObj.dispatcherId.split('|||');
        // load dependencies and dapp content
        await dappBrowser.dapp.loadDAppDependencies(dappEns, false);
        const dapp = await dappBrowser.System.import(`${ dappEns }!dapp-content`);
        const dispatcher = dapp[dispatcherName];

        // add translation to correctly display instance dispatcher titles
        if (dapp.translations) {
           Object.keys(dapp.translations)
             .forEach(key => this.$i18n.add(key, dapp.translations[key]));
        }

        await Promise.all(Object.keys(dispatcherObj.entries).map(async (instanceId: string) => {
          const entry = dispatcherObj.entries[instanceId];
          const instance = new DispatcherInstance({
            queue,
            dispatcher,
            runtime,
            data: entry.data,
            stepIndex: entry.stepIndex,
            id: instanceId,
            error: entry.error,
            customPrice: entry.customPrice,
          });

          // apply all queu instances to the queue instance object
          this.$set(this.queueInstances, instanceId, instance);
        }));
      } catch (ex) {
        runtime.logger.log(ex, 'error');
      }
    }));

    // set queue count
    const setQueueCount = () => {
      const instances = Object.keys(this.queueInstances).map(key => this.queueInstances[key]);
      this.queueCount = instances.filter(subInstance => !subInstance.error).length;
      this.queueErrorCount = instances.filter(subInstance => !!subInstance.error).length;
    };
    setQueueCount();
    this.queueLoading = false;

    // watch for queue updates
    if (!this.queueWatcher) {
      this.queueWatcher = Dispatcher.watch((event: CustomEvent) => {
        const instance = event.detail.instance;

        switch (instance.status) {
          case 'finished':
          case 'deleted': {
            delete this.queueInstances[instance.id];
            break;
          }
          case 'accept': {
            this.startDispatcherInstance(instance);
            break;
          }
        }

        if (instance.status !== 'finished' && instance.status !== 'deleted') {
          // if the watch was already defined and it's not the incoming instance, copy only the
          // values
          this.$set(this.queueInstances, instance.id, instance);
        }

        setQueueCount();
      });
    }
  }

  /**
   * Starts an dispatcher instances and checks for accept status.
   *
   * @param      {any}  instance  an dispatcher instance
   */
  startDispatcherInstance(instance: any) {
    if (instance.status === 'accept') {
      this.instanceInteraction = { type: 'accept', instance };

      (<any>this.$refs).instanceInteraction.show();
    } else {
      instance.start();
    }
  }
}
