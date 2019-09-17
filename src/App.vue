<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from "./store.js";
import { EventBus } from "./eventBus.js";

export default {
  name: "app",
  mounted() {
    // after user login success will redirect user to home page
    EventBus.$on("go-home", () => {
      this.$router.push({ path: "home" }).catch(err => {
        return err;
      });
    });
  },
  created() {
    //change the route to login when there's no userId in store
    let userId = store.state.userId;
    if (!userId) {
      this.$router.push({ path: "login" }).catch(err => {
        return err;
      });
    }
  }
};
</script>
