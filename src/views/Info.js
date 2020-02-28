import React, { useState, useEffect } from "react";
import { useApi } from "../api";
import { useAuth0 } from "../auth";

function Info() {
  const { user } = useAuth0();
  const { getLastActiveUsers, getDoorCode } = useApi();
  const [lastActiveUsers, setLastActiveUsers] = useState();
  const [doorCode, setDoorCode] = useState();

  useEffect(() => {
    getLastActiveUsers(setLastActiveUsers);
    getDoorCode(setDoorCode);
  }, []); // eslint-disable-line

  return (
    <>
      <p>{JSON.stringify(lastActiveUsers)}</p>
      <p>{JSON.stringify(doorCode)}</p>
      <p>{JSON.stringify(user, null, 2)}</p>
    </>
  );
}

export default Info;
