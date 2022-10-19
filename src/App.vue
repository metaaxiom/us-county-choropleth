<template>
  <Header />
  <main>
    <div id="main-content-container" class="general-content-container">
      <UsMap />
      <MapSidebar />
    </div>
    <div class="general-content-container">
      <div id="instructions">
        <h3>Instructions</h3>
        <p>
          To move around the map freely, first make sure that the "Selecting"
          checkbox displayed in the top-right corner of the map is unchecked.
          Then, you can pan around the map by clicking and dragging the mouse,
          and zoom in and out using the scroll wheel.
        </p>
        <p>
          To make selections on the map, first make sure that the "Selecting"
          checkbox is checked. Then, click to select a single county, or click
          and drag across the map to select a group of counties. The color you
          mark with is listed at the top of the sidebar, and can be changed by
          clicking on it. Each new color used will result in a new group being
          created and displayed in the sidebar. You can assign your own name to
          each group by clicking on its placeholder name ("Group N"), and typing
          in your preferred name. For convenience, you can also collapse a group
          of selection by clicking on the arrow next to its name.
        </p>
        <p>
          To save your selection for later, click the "Save" option on the
          right-hand side of the header. You will receive a code, which you must
          then save. The easiest way to store it is probably in a plain text
          file. You will need this code to load your selection in the future.
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import Header from "./components/Header.vue";
import UsMap from "./components/UsMap.vue";
import MapSidebar from "./components/MapSidebar.vue";

export default {
  name: "App",
  components: {
    Header,
    UsMap,
    MapSidebar,
  },
  created() {
    document.title = "Population Choropleth";
  },
};
</script>

<style>
@import "./styles/variables.css";

body {
  margin: 0;
  font-family: "Lato";
  background-color: var(--bg-base);
  color: #fff;
}
.general-content-container {
  width: 100%;
  max-width: 1320px;
  min-width: 1200px;
  margin: 0 auto;
  padding-left: 8px;
  padding-right: 8px;
  box-sizing: border-box;
}
#main-content-container {
  display: flex;
  align-items: stretch;
}
#instructions {
  color: var(--icon-light);
}
</style>
