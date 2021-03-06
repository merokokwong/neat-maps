<template>
  <div class="google-map">
    <gmap-map :center="center" :zoom="zoom">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :icon="m.icon"
        @click="center = m.position"
      ></gmap-marker>
    </gmap-map>

    <div class="category-color" v-if="markerColor.length > 0">
      <h4>Category Markers</h4>
      <div v-for="obj in markerColor" :key="obj.color">
        <img
          :src="
            'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=•|' +
              obj.color
          "
        />
        {{ obj.category }}
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../eventBus.js";
import store from "../store.js";

export default {
  name: "GoogleMap",
  data() {
    return {
      // center the map to US
      center: { lat: 39.8097343, lng: -98.5556199 },
      zoom: 4
    };
  },
  computed: {
    markerColor() {
      return store.state.markerColor;
    },
    markers() {
      return store.state.markers;
    }
  },
  mounted() {
    EventBus.$on("get-csv-location", csv => {
      // chunk csv to every 10, to avoide hitting "OVER_QUERY_LIMIT".
      let chunkArray = this.chunk(csv.data, 10);
      // send the first 10 request, and wait 10s before sending the next request
      this.loopSearch(chunkArray[0]);
      for (var i = 1; i < chunkArray.length; i++) {
        let arr = chunkArray[i];
        //REVIEW: optimise less than 10s?
        setTimeout(
          () => {
            this.loopSearch(arr);
          },
          10000,
          arr
        );
      }
    });

    EventBus.$on("recenter-gmap", lastMarker => {
      let lat = lastMarker.position.lat;
      let lng = lastMarker.position.lng;

      this.center = {
        lat,
        lng
      };
      this.zoom = 8;
    });
  },

  methods: {
    chunk(array, size) {
      const chunked_arr = [];
      let index = 0;
      while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
      }
      return chunked_arr;
    },
    loopSearch(arr) {
      for (var i = 0; i < arr.length; i++) {
        this.searchLocation(arr[i]);
      }
    },
    searchLocation(data) {
      /* global google */
      // TODO: edge case: if address is invaild;
      let geocoder = new google.maps.Geocoder();
      let address = data.ADDRESS.concat(data.CITY, data.STATE, data.ZIPCODE);

      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          let lat = results[0].geometry.location.lat();
          let lng = results[0].geometry.location.lng();
          EventBus.$emit(
            "geocode-data",
            Object.assign(data, { lat: lat, lng: lng })
          );
        } else if (status === "OVER_QUERY_LIMIT") {
          console.log("OVER_QUERY_LIMIT");
        }
      });
    }
  }
};
</script>
