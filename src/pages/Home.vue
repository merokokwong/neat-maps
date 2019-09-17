<template>
  <div>
    <CsvUpload />
    <GoogleMap />
  </div>
</template>
<script>
import CsvUpload from "../components/CsvUpload.vue";
import GoogleMap from "../components/GoogleMap.vue";

export default {
  name: "Home",
  components: {
    CsvUpload,
    GoogleMap
  }
};
</script>
