<template>
  <div class="csv-list">
    <div v-if="csvList.length > 0">
      <h3>Lastest upload</h3>
      <p>
        Will keep the most recent 3 CSV.
      </p>
      <ol>
        <li v-for="obj in csvList" :key="obj.file.uuid">
          <span :class="{ selected: obj.uuid == currentCsvId }">
            {{ obj.file.name }}
          </span>
          <button
            v-if="obj.data.length > 0"
            class="btn"
            @click="viewMap(obj.uuid)"
          >
            View in map
          </button>
          <button
            v-else
            class="btn"
            id="show-preview-modal"
            @click="showPreviewModal(obj.uuid)"
          >
            Preview Data
          </button>
        </li>
      </ol>
    </div>

    <modal v-show="isModalVisible" @close="closePreviewModal">
      <div slot="header">
        <h3 class="modal-title">CSV: {{ modalTitle }}</h3>
        <p>
          Please select the correct column name <br />
          accroding to the first row of this CSV. <br />
          Value should not be duplicate.
        </p>
      </div>
      <div slot="body">
        <CsvPreview ref="child" />
        <div class="error-msg" v-if="error">
          {{ error }}
        </div>
      </div>
      <div slot="footer">
        <button
          v-if="!isLoading"
          type="button"
          name="button"
          class="btn-green"
          v-on:click="handleMapColumns()"
        >
          Map Column
        </button>

        <div class="is-loading" v-if="isLoading">
          <p>Just few seconds, stay with me!</p>
          <Spinner />
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Papa from "papaparse";
import { EventBus } from "../eventBus.js";
import CsvPreview from "./CsvPreview.vue";
import Spinner from "./Spinner.vue";
import Modal from "./Modal.vue";
import store from "../store.js";

export default {
  name: "CsvList",
  components: {
    CsvPreview,
    Modal,
    Spinner
  },
  data() {
    return {
      isModalVisible: false,
      modalTitle: null,
      isLoading: false,
      error: null
    };
  },
  computed: {
    csvList() {
      return store.state.csvList;
    },
    currentCsvId() {
      return store.state.currentCsvId;
    }
  },
  mounted() {
    EventBus.$on("geocode-data", payLoad => {
      let fileLenght = this.$refs.child.csvData().data.length;
      let currentCsvObj = store.getters.currentCsvObj;
      let currentCsvId = store.state.currentCsvId;
      currentCsvObj.data.push(payLoad);

      if (currentCsvObj.data.length === fileLenght) {
        this.closePreviewModal();
        this.viewMap(currentCsvId);
      }
    });

    EventBus.$on("open-csv-preview", uuid => {
      this.showPreviewModal(uuid);
    });
  },
  methods: {
    viewMap(uuid) {
      store.commit("selectCsv", uuid);

      let currentCsvObj = store.getters.currentCsvObj;
      let data = currentCsvObj.data;
      let markers = [];

      let allCategory = data.map(item => item.CATEGORY);
      let uniqueCategory = [...new Set(allCategory)];
      let markerColor = this.createMarkerColor(uniqueCategory);

      data.forEach(obj => {
        let lat = obj.lat;
        let lng = obj.lng;
        let color = this.colorForCategory(obj.CATEGORY, markerColor);
        let url =
          "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=•|";

        let marker = {
          position: {
            lat: lat,
            lng: lng
          },
          icon: {
            url: url + color
          }
        };
        markers.push(marker);
      });
      store.commit("updateMarkers", markers);
      EventBus.$emit("recenter-gmap", markers[markers.length - 1]);
    },
    colorForCategory(cat, markerColor) {
      let result = markerColor.find(obj => obj.category === cat);
      return result.color;
    },
    createMarkerColor(uniqueCategory) {
      let result = [];
      let color = [
        "449DD1",
        "13D8AA",
        "FEB019",
        "FF4560",
        "775DD0",
        "3F51B5",
        "4CAF50",
        "D7263D"
      ];

      for (var i = 0; i < uniqueCategory.length; i++) {
        let obj = {
          category: uniqueCategory[i],
          color: color[i]
        };
        result.push(obj);
      }
      store.commit("addMarkerColor", result);
      return result;
    },
    showPreviewModal(uuid) {
      this.isModalVisible = true;

      let currentCsvObj = store.getters.currentCsvObj;
      this.modalTitle = currentCsvObj.file.name;
      let csv = currentCsvObj.file;

      //get the CSV data to JSON
      Papa.parse(csv, {
        skipEmptyLines: true,
        complete: result => {
          let csv_input = {
            file: csv,
            uuid: uuid,
            data: result.data
          };
          EventBus.$emit("parse-csv", csv_input);
        },
        //TODO: return error to user
        error(errors) {
          console.log("error", errors);
          this.error = errors;
        }
      });
    },
    closePreviewModal() {
      this.isModalVisible = false;
      this.modalTitle = null;
      this.isLoading = false;
      EventBus.$emit("clean-preview-data");
    },
    findDuplicates(arr) {
      let duplicateItems = [];
      arr.filter((item, index) => {
        if (arr.indexOf(item) != index) {
          duplicateItems.push(item);
        }
      });

      return duplicateItems;
    },
    checkMapColumns() {
      // check columns map correct (no duplicate, no empty)
      let col = this.$refs.child.columnsMap();
      let value = Object.values(col);
      let duplicate = this.findDuplicates(value);

      for (var i = 0; i < value.length; i++) {
        if (value[i] === null) {
          this.error = "Please select value for each column.";
        } else if (duplicate.length > 0) {
          this.error = "Column can't be duplicate.";
        }
      }

      return true;
    },
    handleMapColumns() {
      this.error = null;
      this.checkMapColumns();

      if (this.error === null) {
        this.isLoading = true;
        let col = this.$refs.child.columnsMap();
        let data = this.$refs.child.csvData().data;
        let uuid = this.$refs.child.csvData().uuid;

        let result = data.map(row => {
          return {
            [col.col0]: row[0],
            [col.col1]: row[1],
            [col.col2]: row[2],
            [col.col3]: row[3],
            [col.col4]: row[4]
          };
        });

        let csv = { uuid: uuid, data: result };
        EventBus.$emit("get-csv-location", csv);
      }
    }
  }
};
</script>
