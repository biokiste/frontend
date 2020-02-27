import React, { useState, useEffect } from "react";
import { useApi } from "../api";

function Info() {
  const { getLastActiveUsers } = useApi();
  const [lastActiveUsers, setLastActiveUsers] = useState();

  useEffect(() => {
    getLastActiveUsers(setLastActiveUsers);
  }, []); // eslint-disable-line

  return <>{JSON.stringify(lastActiveUsers)}</>;
}

export default Info;
