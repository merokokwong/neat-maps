<template>
  <div>
    Mock User Login <br />
    <button class="btn-green" type="button" name="button" @click="login">
      Log Me In
    </button>
  </div>
</template>

<script>
import axios from "axios";
import store from "../store.js";
import { EventBus } from "../eventBus.js";

export default {
  name: "Login",
  methods: {
    login() {
      //mock login user
      var bodyFormData = new FormData();
      bodyFormData.set("email", "meroko@gmail.com");
      bodyFormData.set("password", "12345");

      axios({
        method: "post",
        url: "http://neat-mvp-api.herokuapp.com/v1/auth",
        data: bodyFormData,
        config: { headers: { "Content-Type": "multipart/form-data" } }
      })
        .then(function(response) {
          //handle success
          EventBus.$emit("go-home");
          store.commit("setUserId", response.data.id);
        })
        .catch(function(response) {
          //handle error
          console.log(response);
        });
    }
  }
};
</script>
