<template>
  <div class="csv-upload-container">
    <CsvInput />
    <CsvList />
  </div>
</template>

<script>
import CsvInput from "./CsvInput.vue";
import CsvList from "./CsvList.vue";

export default {
  name: "CsvUpload",
  components: {
    CsvInput,
    CsvList,
  },
  data() {
    return {

    };
  },
  methods: {
  }
};
</script>
