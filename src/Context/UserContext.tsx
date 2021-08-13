import React, { createContext, useReducer } from "react";

interface State {
    logged: boolean,
}

interface Action {
    type: 'LOG_IN' | 'LOG_OUT';
}

export const UserContext = createContext<{ state: State, dispatch: React.Dispatch<any>; } | null>(null);
const initialState: State = {
    logged: false
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