<template>
  <div id="color-panel-container">
    
    <div id="current-color-panel">
      <div 
        id="selection-color-picker-wrapper" 
        :style="`background-color: ${currColorPickerVal};`"
      >
        <input 
          type="color" 
          v-model="currColorPickerVal" 
          id="selection-color-picker"
        >
      </div>
      <label for="selection-color-picker" class="color-panel-label">Current Color</label>
    </div>
    
    <div id="former-colors-panel-container" v-if="formerSelectionsColors.length > 0">
      <div class="color-panel-label">Used Colors</div>
      <div id="former-colors-boxes-container">
        <div 
          v-for="(formerColor, fcIdx) in formerSelectionsColors" 
          :key="fcIdx"
          class="former-color-box"
          :style="`background-color: ${formerColor};`"
          @click="updateCurrSelectionColor(formerColor)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MapSelectionColorPicker',
  data(){
    return {}
  },
  computed: {
    ...mapState(['currSelectionColor', 'formerSelectionsColors', 'defaultSelectionColor']),
    currColorPickerVal: {
      get(){
        return this.currSelectionColor;
      },
      set(newColor){
        this.updateCurrSelectionColor(newColor);
      }
    }
  },
  methods: {
    ...mapActions(['updateCurrSelectionColor'])
  },
  mounted(){
    this.updateCurrSelectionColor(this.defaultSelectionColor);
  }
}
</script>

<style>
#current-color-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-dark);
  border-radius: 12px;
  padding-right: 10px;
}

#former-colors-panel-container {
  min-height: 60px;
  margin-top: 8px;
}
.color-panel-label {
  font-size: 0.8em;
  font-weight: bold;
  color: #fff;
}
#selection-color-picker-wrapper,
#selection-color-picker {
  display: inline-block;
  border-radius: 100%;
}
#selection-color-picker-wrapper {
  margin-right: 6px;
}
#selection-color-picker {
  opacity: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;
}
#former-colors-boxes-container {
  margin-top: 4px;
}
.former-color-box {
  display: inline-block;
  height: 15px;
  width: 15px;
  margin-right: 3px;
  border-radius: 100%;
  cursor: pointer;
}
</style>