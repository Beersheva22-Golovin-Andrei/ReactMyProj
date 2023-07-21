import { createSlice } from "@reduxjs/toolkit";

const initialState: { openDetails: boolean} = {
    openDetails: false
}

const detailsSlice = createSlice({
    initialState,
    name: 'detailsSlice',
    reducers: {
        set: (state) => {
            state.openDetails = true;
        },
        reset: (state) => {
            state.openDetails = false;
        }

    }
});

export const detailsAction = detailsSlice.actions;
export const detailsReducer = detailsSlice.reducer;