<template>
  <header>
    <div class="general-content-container">
      <div id="header-logo">US County Choropleth</div>
      <MapOptions />
    </div>
  </header>
</template>

<script>
import MapOptions from "./MapOptions.vue";

export default {
  name: "Header",
  components: {
    MapOptions,
  },
};
</script>

<style>
@import "../styles/variables.css";

header {
  background-color: var(--bg-base);
  border-bottom: 1px solid var(--line-dark);
}
header .general-content-container {
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
#header-logo {
  font-family: "Consolas";
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
