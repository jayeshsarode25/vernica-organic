import { createSlice } from "@reduxjs/toolkit";


const searchSlice = createSlice({
    name: "search",
    initialState:{
        query: '',
        results: [],
        loading: false,
        error: null,
    },
    reducers:{
        setQuery(state,action){
            state.query = action.payload;
        },
        setResults(state,action){
            state.results = action.payload;
            state.loading = false;
        },
        setLoading(state, action){
            state.loading = true;
            state.error = null;
        },
        setError(state, action){
            state.error = action.payload;
            state.loading = false;
        },
        clearResult(state){
            state.results = [];
        }
    }
})

export const{
    setQuery,
    setResults,
    setLoading,
    setError,
    clearResult
} = searchSlice.actions;

export default searchSlice.reducer;