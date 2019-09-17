import Vue from "vue";
import App from "./App.vue";
import dotenv from "dotenv";
dotenv.config();
import store from "./store";
import "@/assets/css/main.scss";
import "font-awesome/css/font-awesome.css";
import * as VueGoogleMaps from "vue2-google-maps";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);
const router = new VueRouter({ routes });

Vue.config.productionTip = false;
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_API_KEY,
    libraries: "places" // necessary for places input
  }
});

let app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

global.vm = app;
