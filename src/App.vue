<template>
  <div id="app">
    <h4>Generation: {{generation}}</h4>
    <h4>Illegal Moves: {{illegalMoves}}</h4>
    <h4>Wins: {{wins}}</h4>
    <h4>Draws: {{draws}}</h4>
    <h4>Popsize: {{popsize}}</h4>
    <button v-if="!initializing && !initialized" @click="initialize">Initialize</button>
    <h5 v-else-if="initializing">Initializing...</h5>
    <button v-if="initialized && !playing" @click="play">Play</button>
    <button v-if="initialized && playing" @click="stop">Stop</button>
    <button v-if="initialized && !games.length" @click="startGame">Start a game</button>
    <button v-if="games.length" @click="nextMove">Advance</button>
    <button v-if="initialized" @click="nextGen10">Gen +10</button>
    <button v-if="initialized" @click="nextGen100">Gen +100</button>
    <div class="game-wrapper">
      <TicTacToe v-for="(game, index) in games" :index="index"></TicTacToe>
    </div>
  </div>
</template>

<script>
import TicTacToe from './TicTacToe.js';
import c_TicTacToe from './components/TicTacToe.vue'
import { mapState } from 'vuex'

export default {
  name: 'app',
  data() {
    return {
      initializing: false,
      initialized: false
    }
  },
  components: {
    TicTacToe: c_TicTacToe
  },
  computed: {
    ...mapState({
      generation: state => state.generation,
      round: state => state.round,
      illegalMoves: state => state.illegalMoves,
      games: state => state.games,
      popsize: state => state.popsize,
      playing: state => state.playing,
      wins: state => state.wins,
      draws: state => state.draws
    })
  },
  methods: {
    initialize() {
      this.initializing = true;
      this.$store.dispatch("initialize").then(() => {
        this.initializing = false;
        this.initialized = true;
      });
    },
    startGame() {
      this.$store.dispatch("startGame")
    },
    nextMove() {
      this.$store.dispatch("nextMove")
    },
    nextMoveUntilOver() {
      this.$store.dispatch("nextMoveUntilOver");
    },
    nextGen10() {
      this.$store.dispatch("next10Generations");
    },
    nextGen100() {
      this.$store.dispatch("next100Generations");
    },
    play() {
      this.$store.dispatch("play");
    },
    stop() {
      this.$store.dispatch("stop");
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.game-wrapper {
  margin-top: 20px;
}

*, *:before, *:after {
  box-sizing: border-box;
}
</style>
