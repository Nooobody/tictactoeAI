<template>
  <div class="wrapper">
    <div class="row" v-for="row in grid">
      <div class="slot" v-for="slot in row">
        {{slot !== 0.5 ? slot === 1 ? 'O' : 'X' : null}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "TicTacToe",
  props: ['index'],
  computed: {
    game() {
      return this.$store.getters.getGameByIndex(this.index);
    },
    grid() {
      return this.game.game.grid;
    }
  }
}
</script>

<style lang="sass" scoped>
  .wrapper
    margin: 40px
    width: 160px
    height: 160px
    float: left

  .row
    float: left

  .slot
    float: left
    width: 50px
    height: 50px
    padding-top: 6px
    font-size: 30px
    border: 1px solid black
    display: inline-block
</style>
