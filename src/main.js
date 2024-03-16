import './assets/base.css';
import './assets/main.css';
import { auth } from './includes/firebase';
import VeeValidatePlugin from './includes/validation';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.config.errorHandler = (err) => {
      console.log(`Error: ${err.message}\nStack: ${err.stack}\nCode: ${err.code}`);
    };
    app.mount('#app');
  }
});
