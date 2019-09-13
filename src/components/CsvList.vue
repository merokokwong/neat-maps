<template>
  <div class="csv-list">
    <div v-if="csvList.length > 0">
      <h3>Lastest upload</h3>
      <p>
        Will keep the most recent 3 CSV.
      </p>
      <ol>
        <li v-for="obj in csvList">
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
          accroding to the first row of this CSV.
        </p>
      </div>
      <div slot="body">
        <CsvPreview ref="child" />
      </div>
      <div slot="footer">
        <button
          type="button"
          name="button"
          class="btn-green"
          v-on:click="handleMapColumns()"
        >
          Map Columns
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import Papa from "papaparse";
import { EventBus } from "../eventBus.js";
import CsvPreview from "./CsvPreview.vue";
import Modal from "./Modal.vue";
import store from "../store.js";

export default {
  name: "CsvList",
  components: {
    CsvPreview,
    Modal
  },
  data() {
    return {
      isModalVisible: false,
      modalTitle: null
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
      let newObj = currentCsvObj.data.push(payLoad);

      if (currentCsvObj.data.length === fileLenght) {
        this.closePreviewModal();
      }
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

      //TODO: zoom in & center map to first marker
    },
    colorForCategory(cat, markerColor) {
      let result = markerColor.find(obj => obj.category === cat);
      return result.color;
    },
    createMarkerColor(uniqueCategory) {
      let result = [];
      let color = [
        "FE7569",
        "FFFF99",
        "008000",
        "000080",
        "FFC300",
        "800080",
        "FF00FF",
        "008080"
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
        }
      });
    },
    closePreviewModal() {
      this.isModalVisible = false;
      this.modalTitle = null;
    },
    handleMapColumns() {
      //TODO: check columns map correct (no duplicate, no empty)
      //TODO: adding loading msg
      //TODO: clear columnMap
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
};
</script>
