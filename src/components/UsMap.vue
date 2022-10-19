<template>
  <div id="map-svg-wrapper">
    <div id="map-control-toolbar">
      <label
        for="map-control-selection-on-check"
        id="map-control-selection-on-label"
        >Selecting</label
      >
      <input
        type="checkbox"
        id="map-control-selection-on-check"
        v-model="isSelectingCheck"
      />
    </div>
    <svg id="map-svg" width="955" height="600"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";

import { mapState, mapActions } from "vuex";

export default {
  name: "UsMap",
  data() {
    return {
      isSelectingCheck: false,
      isDragSelecting: false,
      isZooming: false,
      currStrokeWidth: "1",
    };
  },
  computed: {
    ...mapState([
      "allCountyData",
      "currSelectionsData",
      "currSelectionColor",
      "defaultCountyEleFill",
    ]),
  },
  mounted() {
    let self = this;
    this.fetchAllCountyData().then(() => {
      self.init.call(self);
    });
  },
  methods: {
    ...mapActions([
      "fetchAllCountyData",
      "addCountyToSelectionsData",
      "changeCountySelectionColor",
      "saveFormerSelectionColor",
    ]),
    init() {
      //const width = 960;
      //const height = 600;
      var svg = d3.select("svg");
      var path = d3.geoPath().projection(null);
      var features = svg.append("g");

      let self = this;
      d3.json("https://d3js.org/us-10m.v2.json", function(error, us) {
        if (error) throw error;

        /* EVENTS & INTERACTIONS - START */
        // tooltip
        let tooltip = d3
          .select("#map-svg-wrapper")
          .append("div")
          .attr("id", "mapHoverTooltip");

        features
          .selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
          .enter()
          .append("path")
          .attr("class", "county")
          .attr("id", function(countyEle) {
            return "f" + countyEle.id;
          })
          .attr("d", path)
          .attr("pointer-events", "visible")
          .on("click", function(countyGeoObj) {
            if (self.isSelectingCheck) {
              // this is county HTML element
              self.makeSelection({
                countyFIPS: countyGeoObj.id,
                currFill: this.style.fill,
              });
            }
          });

        features
          .on("mousedown", (x) => {
            // d3.event.stopImmediatePropagation();
            if (self.isSelectingCheck) {
              self.isDragSelecting = true;
            }
          })
          .on("mouseup", (x) => {
            // will only run mouseup if isSelectingCheck == true
            // d3 zoom consumes event otherwise
            self.isDragSelecting = false;
          });

        features.selectAll("path").on("mouseover", function(target, d) {
          if (self.isDragSelecting) {
            self.makeSelection({
              countyFIPS: target.id,
              currFill: this.style.fill,
            });
          } else {
            if (!self.isZooming) {
              tooltip.style("visibility", "visible");
            }
          }
        });
        features.selectAll("path").on("mousemove", function(target) {
          let hovCountyDatumObj = self.allCountyData.get(target.id);
          let mapSvgBounds = document
            .getElementById("map-svg")
            .getBoundingClientRect();
          tooltip.text(
            `${hovCountyDatumObj.countyName}, ${hovCountyDatumObj.stateName}`
          );
          tooltip.style("left", `${d3.event.pageX - mapSvgBounds.x + 15}px`);
          tooltip.style("top", `${d3.event.pageY - mapSvgBounds.y - 15}px`);
        });
        features.selectAll("path").on("mouseout", function() {
          tooltip.style("visibility", "hidden");
        });
        /* EVENTS & INTERACTIONS - END */

        features
          .append("path")
          .datum(
            topojson.mesh(us, us.objects.counties, function(a, b) {
              return a !== b && !((a.id / 1000) ^ (b.id / 1000));
            })
          )
          .attr("class", "county-border")
          .attr("d", path)
          .attr("stroke-width", self.currStrokeWidth);

        features
          .append("path")
          .datum(
            topojson.mesh(us, us.objects.states, function(a, b) {
              return a !== b;
            })
          )
          .attr("class", "state-border")
          .attr("d", path)
          .attr("stroke-width", self.currStrokeWidth);

        /* Zooming functionality */
        svg.call(
          d3
            .zoom()
            .filter(() => {
              return !self.isSelectingCheck;
            })
            .scaleExtent([1, 50])
            .on("start", function() {
              self.isZooming = true;
              tooltip.style("visibility", "hidden");
            })
            .on("zoom", function() {
              features.attr("transform", d3.event.transform);

              if (d3.event.transform.k < 3) {
                self.currStrokeWidth = "1";
              } else if (d3.event.transform.k < 5) {
                self.currStrokeWidth = "0.4";
              } else if (d3.event.transform.k < 8) {
                self.currStrokeWidth = "0.2";
              } else {
                self.currStrokeWidth = "0.1";
              }
              features
                .selectAll("path")
                .attr("stroke-width", self.currStrokeWidth);
            })
            .on("end", function() {
              self.isZooming = false;
            })
        );
      });
    },
    makeSelection({ countyFIPS, currFill }) {
      let selectionColor = this.currSelectionColor;
      // currFill = this.rgbToHex(currFill); // won't convert if already hex

      if (currFill == "" || currFill == this.defaultCountyEleFill) {
        // not selected or selected w/ default color, so fill & add new entry
        d3.select(`#f${countyFIPS}`).style("fill", selectionColor);
        this.saveFormerSelectionColor(); // won't save duplicates
        this.addCountyToSelectionsData({ countyFIPS, selectionColor });
      } else {
        // already selected w/ non-default color
        // if active selecting color is different from curr fill, allow color change
        // otherwise, don't allow duplicate selection
        if (selectionColor != currFill) {
          d3.select(`#f${countyFIPS}`).style("fill", selectionColor);
          this.changeCountySelectionColor({
            countyFIPS,
            newSelectionColor: selectionColor,
          });
        }
      }
    },
  },
};
</script>

<style>
@import "../styles/variables.css";

#map-svg-wrapper {
  position: relative;
  background-color: var(--bg-dark);
}

#map-control-toolbar {
  position: absolute;
  top: 1%;
  right: 1%;
  display: flex;
  align-items: center;
  padding: 2px 6px;
  background: #fff;
  border: 1px solid #000;
  border-radius: 3px;
}
#map-control-selection-on-label {
  display: inline-block;
  font-size: 14px;
  color: #000;
}
#map-control-selection-on-check {
  margin: 0 0 0 6px;
  height: 16px;
  width: 16px;
  cursor: pointer;
}

.county {
  fill: #eaeaea;
  cursor: pointer;
}
.county:hover {
  fill: #dddddd;
}
.county-border {
  fill: none;
  stroke: #ccc;
}
.state-border {
  fill: none;
  stroke: #ccc;
}
.overlay {
  fill: none;
}

#mapHoverTooltip {
  position: absolute;
  visibility: hidden;
  background-color: #fff;
  color: #000;
  border: 1px solid #000;
  border-radius: 2px;
  padding: 1px 2px;
  font-size: 0.8em;
  white-space: nowrap;
  /* Prevent tooltip text highlighting */
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version */
}
</style>
