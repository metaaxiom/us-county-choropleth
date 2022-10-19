<template>
  <div id="map-sidebar">
    <MapSelectionColorPicker />
    <MapLegend />
  </div>
</template>

<script>
import MapSelectionColorPicker from "./MapSelectionColorPicker.vue";
import MapLegend from "./MapLegend.vue";

export default {
  name: "MapSidebar",
  components: {
    MapSelectionColorPicker,
    MapLegend,
  },
};
</script>

<style>
@import "../styles/variables.css";

#map-sidebar {
  padding: 10px;
  flex-basis: 100%;
  background-color: var(--bg-light);
  max-height: 600px;
  overflow-y: scroll;
  box-sizing: border-box;
}
</style>
