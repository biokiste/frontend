import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback
} from "react";

const CalculatorContext = createContext();

const initialState = "0";

function inputReducer(state, action) {
  const { type, value } = action;
  switch (type) {
    case "ADD": {
      if (state.includes(",") && value === ",") {
        return state;
      }
      return state === "0" && value !== "," ? value : `${state}${value}`;
    }
    case "REMOVE": {
      return state.length === 1 ? "0" : state.slice(0, state.length - 1);
    }
    case "RESET": {
      return initialState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function CalculatorProvider(props) {
  const { children } = props;
  const [state, dispatch] = useReducer(inputReducer, initialState);
  const add = useCallback(value => dispatch({ type: "ADD", value }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const remove = useCallback(() => dispatch({ type: "REMOVE" }), []);
  const value = useMemo(() => {
    return {
      value: state,
      add,
      reset,
      remove
    };
  }, [state, add, reset, remove]);
  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}

export { CalculatorProvider, useCalculator };
