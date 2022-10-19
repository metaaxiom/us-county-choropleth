<template>
  <div id="map-options-container">
    <div id="map-options-btn-container">
      <button class="map-options-btn" @click="toggleModal('saveMap')">
        <i class="fas fa-save"></i>
        <span class="map-options-btn-txt">Save</span>
      </button>
      <button class="map-options-btn" @click="toggleModal('loadMap')">
        <i class="fas fa-file-upload"></i>
        <span class="map-options-btn-txt">Load</span>
      </button>
    </div>

    <div id="map-options-modal-overlay" :class="overlayToggleClass">
      <div id="modal-save-map" class="map-options-modal" v-if="modalStatus.saveMap">
        <button class="modal-exit-btn" @click="toggleModal()">
          <i class="fas fa-times"></i>
        </button>
        <h2>Save Map</h2>
        <p>This process will generate a code that stores your current map selections. You can save this code in a text file, and load it at a later date to retrieve your saved selections.</p>
        <button id="save-map-btn" @click="saveMap()">Generate Save Code</button>
        <code id="save-map-generated-key">
          {{ (lastGeneratedSaveCode) ? lastGeneratedSaveCode : 'Code will appear here...' }}
        </code>
      </div>
      <div id="modal-load-map" class="map-options-modal" v-if="modalStatus.loadMap">
        <button class="modal-exit-btn" @click="toggleModal()">
          <i class="fas fa-times"></i>
        </button>
        <h2>Load Map</h2>
        <p>If you have previously saved a map selection, you can input the generated code below to load the selection.</p>
        <label for="load-map-modal__code-txtarea">Selection Code:</label>
        <textarea id="load-map-modal__code-txtarea" rows="6" v-model="loadMapCodeInput"></textarea>
        <button @click="loadMap()">Load Map</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

import { mapState, mapActions } from 'vuex';

export default {
  name: 'MapOptions',
  data(){
    return {
      modalStatus: {
        saveMap: false,
        loadMap: false
      },
      modalOverlayOn: false,
      lastGeneratedSaveCode: '',
      loadMapCodeInput: ''
    }
  },
  computed: {
    ...mapState([
      'currSelectionsData', 'defaultCountyEleFill', 
      'defaultSelectionColor', 'formerSelectionsColors'
    ]),
    overlayToggleClass(){
      return (this.modalOverlayOn) ? 'overlay-show' : 'overlay-hide';
    }
  },
  methods: {
    ...mapActions([
      'clearSelectionData', 'addCountyToSelectionsData', 'saveFormerSelectionColor', 
      'clearColorsData', 'updateCurrSelectionColor', 'assignNameToColorGrpManually'
    ]),
    toggleModal(modalName = ''){
      if(modalName == ''){
        this.modalOverlayOn = false;
        for(let msKey of Object.keys(this.modalStatus)){
          this.modalStatus[msKey] = false;
        }
        return;
      }
      this.modalOverlayOn = true;
      this.modalStatus[modalName] = true;
    },
    saveMap(){
      if(Object.keys(this.currSelectionsData).length === 0){
        alert('There are no selections to save. Please select some counties on the map first.');
        return;
      }

      let saveCode = '';
      for(let [colorHex, colorGroup] of Object.entries(this.currSelectionsData)){
        // [hexnum, grpname] w/ no comma, no space
        saveCode += '[' + colorHex.replace('#', '');
        if(colorGroup.colorGroupName.length > 0) saveCode += colorGroup.colorGroupName;
        saveCode += ']';

        for(let FIPS of Object.keys(colorGroup.selectedCounties)){
          saveCode += FIPS;
        }
      }
      this.lastGeneratedSaveCode = saveCode;
    },
    loadMap(){
      if(!this.loadMapCodeInput){
        alert('Please enter a save code to load. If you don\'t have one, you can generate it using the save function.');
        return;
      }

      let loadConfirm = confirm('This will clear any current selections, and attempt to load new ones from the code you\'ve inputted. Continue?');
      if(loadConfirm){
        try {
          this.clearMapColorsAndSelectionsData(); // reset

          let self = this;
          let codeSplitArr = this.loadMapCodeInput.trim().split('[');
          let lastAppliedColor;
          for(let cgIdx = 1; cgIdx < codeSplitArr.length; cgIdx++){
            // first index will be empty str, so skip it

            let colorGrp = codeSplitArr[cgIdx];
            let selectionColor = '#' + colorGrp.substring(0, 6);
            let grpHeadEndIdx = colorGrp.indexOf(']');
            let colorGrpName = (grpHeadEndIdx == 6) ? '' : colorGrp.substring(6, grpHeadEndIdx);
            
            let colorGrpEntriesArr = (colorGrp.substring(grpHeadEndIdx+1)).split(/(?=(?:.....)*$)/)
            
            colorGrpEntriesArr.forEach(countyFIPS => {
              d3.select(`#f${countyFIPS}`).style('fill', selectionColor);
              self.saveFormerSelectionColor(selectionColor);
              self.addCountyToSelectionsData({countyFIPS, selectionColor});
            });
            if(colorGrpName.length > 0){
              this.assignNameToColorGrpManually({
                colorGroupHex: selectionColor, nameToAssign: colorGrpName
              });
            }
            if(cgIdx == codeSplitArr.length-1) lastAppliedColor = selectionColor;
          }
          this.updateCurrSelectionColor(lastAppliedColor ? lastAppliedColor : this.defaultSelectionColor);
          this.toggleModal();
        }catch(e){
          alert('Failed to load map selection. Make sure you inputted the code correctly.');
          console.log('Failed to load selection, with error:', e);
        }
      }
    },
    clearMapColorsAndSelectionsData(){
      // clear map
      for(let colorGrp of Object.values(this.currSelectionsData)){
        for(let countyObj of Object.values(colorGrp.selectedCounties)){
          d3.select(`#f${countyObj.FIPS}`).style('fill', this.defaultCountyEleFill);
        }
      }
      this.clearSelectionData();
      this.clearColorsData();
    }
  }
}
</script>

<style scoped>
#map-options-modal-overlay {
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
}
#map-options-modal-overlay.overlay-show {
  display: flex;
  background: rgba(0, 0, 0, 0.6);
}
.map-options-modal {
  position: relative;
  width: 600px;
  padding: 20px;
  z-index: 100;
  color: #fff;
  background: #36393f;
  border: 1px solid #26282c;
  border-radius: 2px;
}
.map-options-modal .modal-exit-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  font-size: 18px;
  background: none;
  color: #fff;
  border: none;
}
.map-options-modal h2 {
  margin-top: 0;
}
.map-options-modal label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.map-options-modal input,
.map-options-modal textarea {
  padding: 8px 10px;
  box-sizing: border-box;
  font-size: 16px;
  border: 1px solid #26282c;
  border-radius: 2px;
}
.map-options-modal textarea {
  width: 100%;
}
.map-options-modal button {
  padding: 8px 12px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  background: rgb(0, 110, 255);
  border: 1px solid rgb(0, 43, 100);
  border-radius: 2px;
  cursor: pointer;
}
#save-map-btn {
  width: 100%;
}
#save-map-generated-key {
  display: block;
  overflow-wrap: anywhere;
  overflow-y: auto;
  max-height: 187px;
  background: #2f3136;
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  border: 1px solid #26282c;
}
#load-map-modal__code-txtarea {
  font-size: 12px;
}

#map-options-btn-container {
  display: flex;
}
.map-options-btn {
  display: flex;
  align-items: center;
  padding: 0;
  margin-left: 15px;
  background: none;
  color: #fff;
  font-size: 14px;
  border: none;
  cursor: pointer;
}
.map-options-btn:first-child {
  margin-left: 0;
}
.map-options-btn i {
  margin-right: 6px;
  font-size: 18px;
  color: var(--icon-light);
}
.map-options-btn-txt {
  font-weight: bold;
  font-size: 14px;
}
</style>