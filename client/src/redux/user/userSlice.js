import { createSlice } from "@reduxjs/toolkit";
import { useReducer } from "react";

const initialState = {
    currentUser : null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState : initialState,
    reducers:{
        signInStart:(state) => {
            state.loading = true;
        },
        signInSuccess: (state,action) => {
            console.log("actin.payload",action.payload);
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure:(state,action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart : (state) => {
            state.loading = true;
        },
        updateUserSuccess : (state,action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure :(state,action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart : (state) => {
            state.loading = true;
        },
        deleteUserSuccess : (state,action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure :(state,action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const {

    signInStart, 
    signInSuccess,
    signInFailure,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess

} = userSlice.actions;

export default userSlice.reducer;