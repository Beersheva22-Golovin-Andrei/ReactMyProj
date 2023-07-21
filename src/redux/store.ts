import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { useSelector } from "react-redux";
import UserData from "../model/UserData";
import { codeReducer } from "./slices/codeSlice";
import CodePayload from "../model/CodePayload";
import { cartReducer } from "./slices/cartSlice";
import { detailsReducer } from "./slices/detailsSlice";

export const store = configureStore({
    reducer: {
     authState: authReducer,
     codeState: codeReducer,
     cartState: cartReducer,
     detailsState: detailsReducer
    }
});
export function useSelectorAuth() {
    return useSelector<any, UserData>(state => state.authState.userData);
}

export function useSelectorCode() {
    return useSelector<any, CodePayload>(state => state.codeState.codeMessage)
}

export function useSelectorOpenCart() {
    return useSelector<any, boolean>(state => state.cartState.openCart)
}

export function useSelectorOpenDetails() {
    return useSelector<any, boolean>(state => state.detailsState.openDetails)
}