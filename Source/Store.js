const Vue = require('vue');
const Vuex = require('vuex');

Vue.use(Vuex);

module.exports = (plugins) => {
	return new Vuex.Store({
		plugins: plugins,
		state: {
			count: 0
		},
		mutations: {
			increment (state,n) {
				state.count += n;
			}
		},
		actions: {
			async run ({ commit }, params) {
				let n = params.n || 1;
				commit('increment',n);
			}
		}
	});
}

