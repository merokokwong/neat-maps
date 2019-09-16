<template>
  <div v-if="csv_payLoad" class="csv-preview">
    <div class="row">
      <span
        class="column"
        v-for="(column, index) in csv_payLoad.data[0]"
        :key="index"
      >
        <span :class="`index--${index}`">
          {{ column }}
        </span>
      </span>
    </div>
    <div class="column-header">
      <DropDown :columnOption="this.columnOption" v-model="columnMap.col0" />
      <DropDown :columnOption="this.columnOption" v-model="columnMap.col1" />
      <DropDown :columnOption="this.columnOption" v-model="columnMap.col2" />
      <DropDown :columnOption="this.columnOption" v-model="columnMap.col3" />
      <DropDown :columnOption="this.columnOption" v-model="columnMap.col4" />
    </div>
  </div>
</template>

<script>
import { EventBus } from "../eventBus.js";
import DropDown from "./DropDown.vue";

export default {
  name: "CsvPreview",
  components: {
    DropDown
  },
  data() {
    return {
      csv_payLoad: null,
      columnOption: ["ADDRESS", "CITY", "STATE", "ZIPCODE", "CATEGORY"],
      columnMap: { col0: null, col1: null, col2: null, col3: null, col4: null }
    };
  },
  mounted() {
    EventBus.$on("parse-csv", payLoad => {
      this.csv_payLoad = payLoad;
    });

    EventBus.$on("clean-preview-data", () => {
      (this.csv_payLoad = null),
        (this.columnMap = {
          col0: null,
          col1: null,
          col2: null,
          col3: null,
          col4: null
        });
    });
  },
  methods: {
    columnsMap() {
      return this.columnMap;
    },
    csvData() {
      return this.csv_payLoad;
    }
  }
};
</script>
