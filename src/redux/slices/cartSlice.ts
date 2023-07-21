import { createSlice } from "@reduxjs/toolkit";
import CodeType from "../../model/CodeType";
import CodePayload from "../../model/CodePayload";

const initialState: { openCart: boolean} = {
    openCart: false
}

const cartSlice = createSlice({
    initialState,
    name: 'cartSlice',
    reducers: {
        set: (state) => {
            state.openCart = true;
        },
        reset: (state) => {
            state.openCart = false;
        }

    }
});

export const cartAction = cartSlice.actions;
export const cartReducer = cartSlice.reducer;