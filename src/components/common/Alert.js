import React, {
  createContext,
  useReducer,
  useContext,
  useRef,
  useEffect
} from "react";
import { AlertSeverity } from "../../consts";

const AlertContext = createContext();

const initialState = {
  show: false,
  message: null,
};

const alertReducer = (state, action) => {
  const { type, message, severity } = action;
  switch (type) {
    case "SHOW": {
      return { show: true, message, severity };
    }
    case "HIDE": {
      return initialState;
    }
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

function AlertProvider(props) {
  const { children, initialState: defaultState } = props;
  const [state, dispatch] = useReducer(
    alertReducer,
    (defaultState && { ...initialState, ...defaultState }) || initialState
  );
  const showAlert = (message, severity) => dispatch({ type: "SHOW", message, severity });
  const hideAlert = () => dispatch({ type: "HIDE" });
  const value = {
    ...state,
    showAlert,
    hideAlert
  };
  return (
    <AlertContext.Provider value={value}>
      <Alert />
      {children}
    </AlertContext.Provider>
  );
}

function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

function Alert() {
  const { show, message, severity, hideAlert } = useAlert();
  const buttonRef = useRef();

  useEffect(() => {
    buttonRef.current && buttonRef.current.focus();
  }, []);

  const onClick = () => {
    hideAlert();
  };

  const color = Object.keys(AlertSeverity).some(key => severity === AlertSeverity[key]) ? severity : "gray";

  return show ? (
    <div className="fixed w-screen h-screen bg-black-translucent p-2 flex items-end sm:items-center justify-center">
      <div className="w-full max-h-full sm:w-auto sm:max-w-sm md:max-w-md bg-white rounded flex justify-center flex-wrap shadow-lg p-2 overflow-scroll">
        <div className="w-full my-4 mx-2 text-center">{message}</div>
        <div className="w-full">
          <button
            tabIndex={1}
            ref={buttonRef}
            className={`w-full bg-${color}-300 px-4 py-2 rounded focus:outline-none focus:bg-${color}-500 hover:bg-${color}-500 active:bg-${color}-700 text-lg`}
            onClick={onClick}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export { AlertProvider, useAlert };
