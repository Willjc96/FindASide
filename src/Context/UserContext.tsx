import React, { createContext, useReducer } from "react";

interface State {
    logged: boolean,
    modalOpen: boolean,
}

interface Action {
    type: 'LOG_IN' | 'LOG_OUT' | 'SET_MODAL_OPEN' | 'SET_MODAL_CLOSED';
}

export const UserContext = createContext<{ state: State, dispatch: React.Dispatch<any>; } | null>(null);
const initialState: State = {
    logged: false,
    modalOpen: false,
};
const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                logged: true
            };
        case 'LOG_OUT':
            return {
                ...state,
                logged: false
            };
        case 'SET_MODAL_OPEN':
            return {
                ...state,
                modalOpen: true
            };
        case 'SET_MODAL_CLOSED':
            return {
                ...state,
                modalOpen: false
            }
        default:
            return state;
    }
};
export const UserContextProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};