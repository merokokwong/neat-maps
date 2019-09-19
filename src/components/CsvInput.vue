<template>
  <div class="csv-input">
    <h1>Welcome to Neat Map</h1>
    <p>
      Upload your CSV with vaild US address, we will display them in a map.
    </p>
    <div class="upload-container">
      <div class="input-file-container">
        <input
          class="input-file"
          type="file"
          ref="file"
          v-on:change="handleFileSelect()"
          accept=".csv"
        />
        <label tabindex="0" for="my-file" class="input-file-trigger"
          >Select a file...</label
        >
      </div>

      <div class="upload-requirements">
        <p>Please make sure that your CSV file meets our requirements:</p>
        <p>
          5 columns: <br />
          ADDRESS, CITY, STATE, ZIPCODE, and CATEGORY <br />
          It doesn't need a column header.
        </p>
        <p>Up to 20 rows.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../eventBus.js";
import store from "../store.js";
import Papa from "papaparse";

export default {
  name: "CsvInput",
  methods: {
    handleFileSelect() {
      let file = this.$refs.file.files[0];
      let uuid = this.uniqueId();
      let csv = {
        file: file,
        uuid: uuid,
        data: []
      };

      if (file) {
        store.commit("selectCsv", uuid);
        store.commit("updateCsvList", csv);

        Papa.parse(file, {
          skipEmptyLines: true,
          complete: result => {
            let csv_input = {
              file: csv,
              uuid: uuid,
              data: result.data
            };
            // TODO: error should be store mutipule errors
            if (result.data.length > 20) {
              store.commit("addNewKeyToCsvObj", {
                error: "File contains more than 20 rows."
              });
            } else {
              // pass CSV data to CsvPreview if no error
              EventBus.$emit("csv-preview-data", csv_input);
              //open CsvPreview
              EventBus.$emit("open-csv-preview", uuid);
            }
          },
          error(errors) {
            console.log("error", errors);
          }
        });
      }
    },
    uniqueId() {
      return (
        Math.random()
          .toString(36)
          .substring(2) + Date.now().toString(36)
      );
    }
  }
};
</script>
