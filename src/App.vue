<template>
  <div id="app">
    <CsvUpload />
    <GoogleMap />
  </div>
</template>

<script>
import CsvUpload from "./components/CsvUpload.vue";
import GoogleMap from "./components/GoogleMap.vue";

export default {
  name: "app",
  components: {
    CsvUpload,
    GoogleMap
  }
};
</script>
