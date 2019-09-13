import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    markerColor: [],
    markers: [],
    csvList: [],
    currentCsvId: null,
  },
  mutations: {
    addMarkerColor(state, color) {
      state.markerColor = color
    },
    selectCsv(state, csvId) {
      state.currentCsvId = csvId
      state.markerColor = []
      state.markers = []
    },
    updateCsvList(state, newCsv) {
      let originList = state.csvList;
      originList.push(newCsv);
      state.csvList = originList.slice(-3);
    },
    updateMarkers(state, markers) {
      state.markers = markers;
    },
  },
  actions: {},
  getters: {
    currentCsvObj(state) {
      return state.csvList.find(obj => obj.uuid === state.currentCsvId)
    }
  }
});
