import { expect } from "chai";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import store from "@/store.js";
import CsvList from "@/components/CsvList.vue";

describe("CsvList.vue", () => {
  const localVue = createLocalVue();
  const wrapper = shallowMount(CsvList, {
    localVue,
    store
  });

  it("findDuplicatesTrue", () => {
    // duplicate value in cloumns Map
    let arr = ["CITY", "CITY", "ADDRESS", "CATEGORY", "ZIPCODE"];
    let duplicateItems = wrapper.vm.findDuplicates(arr);
    expect(duplicateItems).to.be.eql(["CITY"]);
  });

  it("findDuplicatesFalse", () => {
    // no duplicate value in cloumns Map
    let arr = ["CITY", "STATE", "ADDRESS", "CATEGORY", "ZIPCODE"];
    let duplicateItems = wrapper.vm.findDuplicates(arr);
    expect(duplicateItems).to.be.eql([]);
  });

  it("createMarkerColor", () => {
    let uniqueCategory = [
      "limited ground floor commercial",
      "one-family dwelling"
    ];
    let result = wrapper.vm.createMarkerColor(uniqueCategory);
    expect(result).to.be.eql([
      {
        category: "limited ground floor commercial",
        color: "449DD1"
      },
      {
        category: "one-family dwelling",
        color: "13D8AA"
      }
    ]);
  });

  it("mapDataToCol", () => {
    let col = {
      col0: "CATEGORY",
      col1: "STATE",
      col2: "CITY",
      col3: "ZIPCODE",
      col4: "ADDRESS"
    };
    let data = [
      [
        "one-family dwelling",
        "CA",
        "Foster City",
        "94404",
        "2545, 777 Shell Blvd"
      ]
    ];
    let result = wrapper.vm.mapDataToCol(data, col);
    expect(result).to.be.eql([
      {
        ADDRESS: "2545, 777 Shell Blvd",
        CATEGORY: "one-family dwelling",
        CITY: "Foster City",
        STATE: "CA",
        ZIPCODE: "94404"
      }
    ]);
  });
});
