import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Badge from "./Badge";

const initialState = { color: "gray" };

function useStatus(url) {
  const [status, setStatus] = useState();
  useEffect(() => {
    let timeout;
    function retry(time = 5000) {
      timeout = setTimeout(() => doRequest(url), time);
    }

    async function doRequest(url) {
      try {
        const res = await fetch(url);
        if (res.status !== 200) {
          setStatus("error");
          retry();
        } else {
          clearTimeout(timeout);
          setStatus("success");
        }
      } catch (err) {
        setStatus("error");
        retry();
      }
    }
    if (url) {
      setStatus("calling");
      doRequest(url);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [url]);

  return status;
}

function reducer(state, action) {
  switch (action.type) {
    case "success":
      return { color: "green" };
    case "error":
      return { color: "red" };
    case "calling":
      return { color: "yellow" };
    default:
      return state;
  }
}

/**
 * Badge visualize reachability of API
 */
function StatusBadge(props) {
  const { name, url } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const status = useStatus(url) || props.status;

  useEffect(() => {
    dispatch({ type: status });
  }, [status]);

  return <Badge color={state.color}>{name}</Badge>;
}

StatusBadge.propTypes = {
  /** Name of API */
  name: PropTypes.string.isRequired,
  /** URL of API */
  url: PropTypes.string,
  /** Status of API*/
  status: PropTypes.oneOf(["success", "calling", "error"])
};

export default StatusBadge;
