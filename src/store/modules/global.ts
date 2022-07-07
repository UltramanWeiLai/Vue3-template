
const state = {}

const mutations = {
    'SET_GLOBAL_STATE': (state: any, data: any) => {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                state[key] = data[key]
            }
        }
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
