<template>
  <div class="select-box">
    <select
      v-model="selectedOption"
      @input="
        event => {
          $emit('input', event.target.value);
        }
      "
    >
      <option v-for="opt in columnOption" :key="opt" :value="opt">
        {{ opt }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "DropDown",
  props: {
    value: null,
    columnOption: Array
  },
  data() {
    return {
      selectedOption: null
    };
  },
  mounted() {
    this.selectedOption = this.value;
  },
  watch: {
    value: function(newValue) {
      this.selectedOption = newValue;
    }
  },
  methods: {}
};
</script>
