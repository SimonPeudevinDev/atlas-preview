/* ATLAS — Trois terrains : déploiements simultanés, renforts et bannière unique. */
(function (A) {
  'use strict';
  var G = A.terrains = {};
  G.BANNER = 20;
  G.fields = [
    { name: 'Bataille', stat: 'atk', label: 'ATQ', icon: 'swords' },
    { name: 'Rempart', stat: 'def', label: 'DÉF', icon: 'shield' },
    { name: 'Oracle', stat: 'esp', label: 'ESP', icon: 'sparkle' }
  ];
  G.value = function (ed, lane, banner) { return A.CHAR[A.ED[ed].charId][G.fields[lane].stat] + (banner ? G.BANNER : 0); };
  function emptyBoard() { return { me: [[], [], []], foe: [[], [], []] }; }
  G.score = function (board) {
    var score = { me: 0, foe: 0 };
    var rows = G.fields.map(function (_, lane) {
      function sum(side) { return board[side][lane].reduce(function (n, unit) { return n + G.value(unit.ed, lane, unit.banner); }, 0); }
      var me = sum('me'), foe = sum('foe'), result = me > foe ? 'win' : me < foe ? 'loss' : 'draw';
      if (result === 'win') score.me++; else if (result === 'loss') score.foe++;
      return { me: me, foe: foe, result: result };
    });
    return { rows: rows, score: score, result: score.me > score.foe ? 'win' : score.me < score.foe ? 'loss' : 'draw' };
  };
  function orders(state, side) {
    var out = [];
    state.hands[side].forEach(function (ed) {
      for (var lane = 0; lane < 3; lane++) {
        out.push({ ed: ed, lane: lane, banner: false });
        if (state.banners[side]) out.push({ ed: ed, lane: lane, banner: true });
      }
    });
    return out;
  }
  // Évalue les fronts révélés et les réserves visibles, jamais le choix courant du joueur.
  G.ai = function (state) {
    var totals = G.score(state.board).rows, responses = orders(state, 'me'), candidates = orders(state, 'foe');
    var final = state.turn + 1 === state.limit, best = null, bestValue = -Infinity;
    candidates.forEach(function (order) {
      var worst = Infinity, sum = 0;
      responses.forEach(function (reply) {
        var utility = 0;
        totals.forEach(function (row, lane) {
          var foe = row.foe + (order.lane === lane ? G.value(order.ed, lane, order.banner) : 0);
          var me = row.me + (reply.lane === lane ? G.value(reply.ed, lane, reply.banner) : 0);
          utility += final ? (foe > me ? 1000 : foe < me ? -1000 : 0) : Math.tanh((foe - me) / 65) * 100;
        });
        worst = Math.min(worst, utility); sum += utility;
      });
      var reserveCost = order.banner ? 24 * (state.limit - state.turn - 1) / state.limit : 0;
      var value = worst * .65 + sum / responses.length * .35 - reserveCost + Math.random() * .05;
      if (value > bestValue) { best = order; bestValue = value; }
    });
    return Object.freeze(best);
  };
  function validHand(eds) {
    return eds.every(function (id) { return A.ED[id] && A.CHAR[A.ED[id].charId]; }) &&
      new Set(eds.map(function (id) { return A.ED[id].charId; })).size === eds.length;
  }
  G.create = function (mine, foes) {
    if (mine.length < 3 || mine.length > 5 || mine.length !== foes.length || !validHand(mine) || !validHand(foes)) return null;
    var state = { board: emptyBoard(), hands: { me: mine.slice(), foe: foes.slice() }, banners: { me: true, foe: true }, turn: 0, limit: mine.length, phase: 'orders', last: null };
    state.enemyOrder = G.ai(state);
    return state;
  };
  function validOrder(state, order, side) {
    return order && state.hands[side].indexOf(order.ed) !== -1 && Number.isInteger(order.lane) && order.lane >= 0 && order.lane < 3 &&
      typeof order.banner === 'boolean' && (!order.banner || state.banners[side]);
  }
  G.resolve = function (state, order) {
    if (!state || state.phase !== 'orders' || state.turn >= state.limit || !validOrder(state, order, 'me') || !validOrder(state, state.enemyOrder, 'foe')) return null;
    var next = { board: emptyBoard(), hands: {}, banners: Object.assign({}, state.banners), turn: state.turn + 1, limit: state.limit, phase: 'reveal', enemyOrder: null, last: {} };
    ['me', 'foe'].forEach(function (side) {
      var action = side === 'me' ? order : state.enemyOrder;
      next.board[side] = state.board[side].map(function (lane) { return lane.slice(); });
      var unit = Object.freeze({ ed: action.ed, banner: action.banner, turn: next.turn });
      next.board[side][action.lane].push(unit);
      next.hands[side] = state.hands[side].filter(function (ed) { return ed !== action.ed; });
      if (action.banner) next.banners[side] = false;
      next.last[side] = { ed: action.ed, lane: action.lane, banner: action.banner, value: G.value(action.ed, action.lane, action.banner) };
    });
    return next;
  };
  G.next = function (state) {
    if (!state || state.phase !== 'reveal' || state.turn >= state.limit) return null;
    var next = Object.assign({}, state, { phase: 'orders', last: null });
    next.enemyOrder = G.ai(next);
    return next;
  };
})(window.ATLAS);
