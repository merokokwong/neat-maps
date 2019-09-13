import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "@/assets/css/main.scss";
import 'font-awesome/css/font-awesome.css';
import * as VueGoogleMaps from "vue2-google-maps";

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCzol4NudU170oJ_SCLRIqjPxYsW7vOthE",
    libraries: "places" // necessary for places input
  }
});


let app = new Vue({
  store,
  render: h => h(App)
}).$mount('#app')


global.vm = app;