import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: null,
    markerColor: [],
    markers: [],
    csvList: [],
    currentCsvId: null
  },
  mutations: {
    addMarkerColor(state, color) {
      state.markerColor = color;
    },
    selectCsv(state, csvId) {
      // will call update when user select new file
      state.currentCsvId = csvId;

      // clear below state when user select new file
      state.markerColor = [];
      state.markers = [];
    },
    removeFile(state, uuid) {
      let originList = state.csvList;
      let filterOutFile = originList.filter(item => item.uuid !== uuid);

      state.csvList = filterOutFile;
    },
    updateCsvList(state, newCsv) {
      // will call update when user select new file
      // newCsv = {
      //   file: file,
      //   uuid: uuid,
      //   data: []
      // }
      let originList = state.csvList;
      originList.push(newCsv);

      // only keep the last 3 files
      state.csvList = originList.slice(-3);
    },
    updateMarkers(state, markers) {
      state.markers = markers;
    },
    setGlobalError(state, error) {
      state.globalError = error;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    addNewKeyToCsvObj(state, kv) {
      let currentCsvObj = state.csvList.find(
        obj => obj.uuid === state.currentCsvId
      );
      let index = state.csvList.indexOf(currentCsvObj);
      let newCsv = Object.assign(currentCsvObj, kv);

      Vue.set(state.csvList, index, newCsv);
    }
  },
  actions: {},
  getters: {
    currentCsvObj(state) {
      return state.csvList.find(obj => obj.uuid === state.currentCsvId);
    }
  }
});
