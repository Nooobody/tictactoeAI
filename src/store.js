import Vue from 'vue'
import Vuex from 'vuex'
import { Network, architect, Neat, methods } from 'neataptic';
import TicTacToe from './TicTacToe.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    popsize: 10,
    generation: 1,
    round: 0,
    roundLimit: 1,
    games: [],
    players: [],
    illegalMoves: 0,
    wins: 0,
    draws: 0,
    neat: null,
    playing: false
  },
  getters: {
    getGameByIndex: (state) => (index) => {
      return state.games[index];
    }
  },
  mutations: {
    play(state) {
      state.playing = true
    },
    stop(state) {
      state.playing = false
    },
    win(state) {
      state.wins += 1;
    },
    draw(state) {
      state.draws += 1;
    },
    updateNeat(state, payload) {
      state.neatX = payload.neatX;
      state.neatO = payload.neatO;
    },
    newGames(state, payload) {
      state.games = payload.games.slice();
      state.playersX = payload.playersX.slice();
      state.playersO = payload.playersO.slice();
    },
    updateGames(state, payload) {
      state.games = payload.games.slice();
    },
    illegalMove(state) {
      state.illegalMoves += 1;
    },
    nextRound(state) {
      state.round += 1;
    },
    nextGeneration(state, payload) {
      state.generation += 1;
      state.round = 0;
      state.illegalMoves = 0;
      state.neatX = payload.neatX;
      state.neatO = payload.neatO;
      state.games = [];
      state.playersX = [];
      state.playersO = [];
    }
  },
  actions: {
    initialize({commit, state}) {
      return new Promise((resolve, reject) => {
        let popsize = state.popsize;

        let net = architect.Random(18, 36, 9);

        // let testData = [];
        // let gameStates = [0, 0.5, 1];
        // for (let i = 0; i < 100; i++) {
        //   let input = [];
        //   let output = [];
        //
        //   let available = [];
        //   for (let spot = 0; spot < 9; spot++) {
        //     let s = gameStates[Math.floor(Math.random() * 3)];
        //     if (s === 0.5) {
        //       input.push(0, 0);
        //       available.push(spot);
        //     }
        //     else if (s === 1) {
        //       input.push(1, 1);
        //     }
        //     else {
        //       input.push(1, 0);
        //     }
        //   }
        //
        //   if (!available.length) {
        //     continue; // Invalid test data.
        //   }
        //
        //   let move = available[Math.floor(Math.random() * available.length)];
        //   // let x = (move % 3) / 3;
        //   // let y = Math.floor(move / 3) / 3;
        //
        //   for (let spot = 0; spot < 9; spot++) {
        //     if (spot === move) {
        //       output.push(1);
        //     }
        //     else {
        //       output.push(0);
        //     }
        //   }
        //
        //   testData.push({
        //     input, output
        //   });
        // }
        //
        // console.log(testData);
        // console.log("Training");
        // net.train(testData, {error: 0.05, iterations: 1000});
        // console.log("Training complete");

        let neatX = new Neat(9, 9, null, {
          mutation: methods.mutation.ALL,
          popsize: popsize,
          elitism: 0.1 * popsize
        });

        let neatO = new Neat(9, 9, null, {
          mutation: methods.mutation.ALL,
          popsize: popsize,
          elitism: 0.1 * popsize
        });

        for (let gen of neatX.population) {
          gen.score = 0;
        }

        for (let gen of neatO.population) {
          gen.score = 0;
        }

        commit("updateNeat", {neatX, neatO});
        resolve();
      });
    },
    startGame({commit, state, dispatch}) {
      if (state.round >= state.roundLimit) {
        dispatch("nextGeneration");
        return;
      }

      let neatX = state.neatX;
      let neatO = state.neatO;

      commit("nextRound");

      let playersX = state.playersX;
      let playersO = state.playersO;
      if (!state.games.length) {
        // This is a new round.
        playersX = neatX.population.map(ply => ({brain: ply, type: 'x'}))
        playersO = neatO.population.map(ply => ({brain: ply, type: 'o'}))
      }

      let games = [];
      for (let playerA of playersX) {
        let availablePlayers = playersO.filter((ply, index) => !ply.game);
        let playerB = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

        playerA.game = true;
        playerB.game = true;

        let game = new TicTacToe();
        games.push({
          game, playerA, playerB,
          operations: 0,
          illegalMoves: 0,
          over: false
        });
      }

      commit("newGames", {games, playersX, playersO});
    },
    nextMove({commit, state, dispatch}) {
      let games = state.games;

      let gamesPlaying = games.filter(game => !game.over);
      if (!gamesPlaying.length) {
        dispatch("startGame");
        return;
      }

      for (let game of games) {
        if (game.over) {
          continue;
        }

        if (game.game.turn === game.playerA.type) {
          let play = game.playerA.brain.activate(game.game.formatGrid());
          if (state.generation % 100 === 0) {
            console.log(play);
          }
          let res = game.game.play(play, game.playerA.type);
          if (!res) {
            game.illegalMoves += 1;
            commit("illegalMove");
            game.playerA.brain.score -= 1 * game.game.getPossibleMoves().length;
            game.over = true;
          }
        }
        else {
          let play = game.playerB.brain.activate(game.game.formatGrid());
          if (state.generation % 100 === 0) {
            console.log(play);
          }
          let res = game.game.play(play, game.playerB.type);
          if (!res) {
            game.illegalMoves += 1;
            commit("illegalMove");
            game.playerB.brain.score -= 1 * game.game.getPossibleMoves().length;
            game.over = true;
          }
        }

        game.operations += 1;

        if (game.operations > 20) {
          game.over = true;
        }

        if (game.game.checkWin() || game.game.checkDraw()) {
          if (game.game.checkWin() === game.playerA.type) {
            game.playerA.brain.score += 1;
            game.playerB.brain.score -= 1;
            commit("win");
          }
          else if (game.game.checkWin() === game.playerB.type) {
            game.playerB.brain.score += 1;
            game.playerA.brain.score -= 1;
            commit("win");
          }
          else {
            commit("draw");
          }
          game.over = true;
        }
      }

      commit("updateGames", {games});
    },
    nextGeneration({commit, state}) {
      let neatX = state.neatX;
      let playersX = state.playersX;
      let neatO = state.neatO;
      let playersO = state.playersO;

      for (let index in neatX.population) {
        neatX.population[index].score = playersX[index].brain.score;
      }
      for (let index in neatO.population) {
        neatO.population[index].score = playersO[index].brain.score;
      }

      // for (let genome of neat.population) {
      //   genome.score -= genome.nodes.length * this.scoreRadius / 10;
      // }

      let generateNextPop = (neat) => {
        neat.sort();
        let newPop = [];

        for (let i = 0; i < neat.elitism; i++) {
          newPop.push(neat.population[i]);
        }

        for (let i = 0; i < neat.popsize - neat.elitism; i++) {
          newPop.push(neat.getOffspring());
        }

        neat.population = newPop;
        neat.mutate();
        neat.generation++;

        for (let gen of neat.population) {
          gen.score = 0;
        }

        return neat;
      }

      neatX = generateNextPop(neatX);
      neatO = generateNextPop(neatO);

      commit("nextGeneration", {neatX, neatO});
    },
    nextMoveUntilOver({commit, state, dispatch}) {
      while (state.games.length > 0) {
        dispatch("nextMove");
      }
    },
    next10Generations({commit, state, dispatch}) {
      let desired = state.generation + 10;
      while (state.generation < desired) {
        if (state.games.length) {
          dispatch("nextMoveUntilOver");
        }
        else {
          dispatch("nextMove");
        }
      }
    },
    next100Generations({commit, state, dispatch}) {
      let desired = state.generation + 100;
      while (state.generation < desired) {
        if (state.games.length) {
          dispatch("nextMoveUntilOver");
        }
        else {
          dispatch("nextMove");
        }
      }
    },
    async play({state, commit, dispatch}) {
      commit("play");
      while (state.playing) {
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 200);
        });
        dispatch("nextMove");
      }
    },
    stop({state, commit, dispatch}) {
      commit("stop");
    }
  }
})
