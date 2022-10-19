<template>
  <div id="map-legend">
    <div
      v-for="(colorGroupData, colorGroupHex, cgdIdx) in currSelectionsData"
      :key="cgdIdx"
      class="legend-selection-container"
      :class="isColorPanelHidden(cgdIdx) ? 'content-hidden' : ''"
    >
      <div
        class="legend-selection-box"
        :style="`border-color: ${colorGroupHex};`"
      >
        <div
          class="legend-selection-box__header"
          :style="`background-color: ${colorGroupHex};`"
        >
          <div class="legend-selection-box__header-inner">
            <div class="color-group-name-input-wrapper">
              <input
                type="text"
                v-model="colorGroupData['colorGroupName']"
                class="color-group-name-input"
                :placeholder="`Group ${cgdIdx + 1}`"
                spellcheck="false"
              />
            </div>
            <button
              class="color-group-toggle-btn"
              @click="toggleColorGroupPanel({ cgdIdx, colorGroupHex })"
            >
              <i class="fas fa-angle-up"></i>
            </button>
          </div>
        </div>

        <div
          class="legend-selection-box__content"
          :id="`cg-panel-content-${colorGroupHex}`"
        >
          <div class="cg-panel-total">
            <div class="cg-panel-total-label">Total Population</div>
            <div class="cg-panel-total-val">
              {{ popTotalForColorGroup(colorGroupHex).toLocaleString() }}
            </div>
          </div>

          <div class="cg-panel-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th align="left">County &amp; State</th>
                  <th align="right">Population</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(countyObj, coIdx) in colorGroupData[
                    'selectedCounties'
                  ]"
                  :key="coIdx"
                >
                  <td>{{ countyObj.countyName }}, {{ countyObj.stateName }}</td>
                  <td align="right">
                    {{ countyObj.countyPop.toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "MapLegend",
  data() {
    return {
      hiddenColorGroupPanels: [],
      // sorting by pop or name?
    };
  },
  computed: {
    ...mapState(["currSelectionsData"]),
    ...mapGetters(["popTotalForColorGroup"]),
    isColorPanelHidden() {
      return (cgdIdx) => {
        if (this.hiddenColorGroupPanels.includes(cgdIdx)) {
          return true;
        }
        return false;
      };
    },
  },
  methods: {
    toggleColorGroupPanel({ cgdIdx, colorGroupHex }) {
      let cgPanelContent = document.getElementById(
        `cg-panel-content-${colorGroupHex}`
      );
      if (this.hiddenColorGroupPanels.includes(cgdIdx)) {
        // already hiden -> so unhide
        this.hiddenColorGroupPanels = this.hiddenColorGroupPanels.filter(
          (hiddenPanelIdx) => hiddenPanelIdx != cgdIdx
        );
        cgPanelContent.style.maxHeight = cgPanelContent.scrollHeight + "px";
        setTimeout(() => {
          cgPanelContent.style.maxHeight = "none";
        }, 300);
      } else {
        // visible -> so hide
        cgPanelContent.style.maxHeight = cgPanelContent.scrollHeight + "px";
        this.hiddenColorGroupPanels.push(cgdIdx);
        cgPanelContent.style.maxHeight = "0";
      }
    },
  },
};
</script>

<style scoped>
@import "../styles/variables.css";

.legend-selection-container {
  background-color: #2f3136;
  color: #fff;
  margin-bottom: 10px;
}
.legend-selection-container:last-child {
  margin-bottom: 0;
}
.legend-selection-box {
  border: 1px solid;
  border-radius: 2px;
}
.legend-selection-box__header,
.cg-panel-total,
.cg-panel-table-wrapper {
  padding: 5px 6px;
}
.legend-selection-box__content {
  overflow: hidden;
  transition: max-height 0.3s, padding 0.3s;
}
.legend-selection-box__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.color-group-toggle-btn {
  padding: 0 0 0 6px;
  box-sizing: border-box;
  background: none;
  color: #fff;
  border: none;
  cursor: pointer;
  text-align: right;
}
.color-group-toggle-btn i {
  font-size: 24px;
  transition: transform 0.3s;
}
.color-group-name-input-wrapper {
  flex-basis: 100%;
}
.color-group-name-input {
  width: 100%;
  padding: 2px 4px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: transparent;
  border: none;
  border-radius: 2px;
}
.color-group-name-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.cg-panel-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #232427;
}
.cg-panel-total-label {
  font-size: 0.7em;
  text-transform: uppercase;
}
.cg-panel-total-val {
  font-weight: bold;
}
table {
  width: 100%;
  border-collapse: collapse;
}
table thead th {
  font-weight: normal;
  text-transform: uppercase;
  color: #b0b0b0;
  font-size: 0.7em;
}
table tbody {
  font-size: 0.9em;
}
table tbody tr:first-child td {
  padding-top: 6px;
}
table tbody tr {
  border-bottom: 1px solid var(--bg-base);
}
table tbody tr:last-child {
  border-bottom: none;
}
table tbody td {
  padding-bottom: 2px;
}

.legend-selection-container.content-hidden {
  opacity: 0.6;
  transition: opacity 0.3s;
}
.legend-selection-container.content-hidden .color-group-toggle-btn i {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
.legend-selection-container.content-hidden .legend-selection-box__content {
  padding-top: 0;
  padding-bottom: 0;
  transition: max-height 0.3s, padding 0.3s;
}
</style>
