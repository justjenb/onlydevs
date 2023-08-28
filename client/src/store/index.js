import { create } from "zustand";

const useStore = create(set => ({
    authUser: null,
    requestLoading: false,
    setAuthUser: function(user) {
        set(state => ({ ...state, authUser: user }));
    },
    setRequestLoading: function(isLoading) {
        set(state => ({ ...state, requestLoading: isLoading }));
    }
}));

export default useStore;
