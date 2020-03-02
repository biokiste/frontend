import React, { useState, useEffect } from "react";
import { useApi } from "../api";
import { Row, ColumnSort } from "../components/table";
import { useTranslation } from "react-i18next";

function LastActiveUsers(props) {
  const { values } = props;
  const { t } = useTranslation("info");
  const columns = {
    visible: ["firstname", "lastname"],
    md: ["date", "email", "mobile"],
  };
  const sorting = ["date", "firstname", "lastname", "email", "mobile"];
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-xl">{t("lastActiveUsers")}</h1>
      <table className="table-fixed w-full my-2">
        <tbody>
          {values.map((value, idx) => {
            const { last_login } = value;

            const date = new Date(last_login);

            return (
              <Row
                key={idx}
                index={idx}
                columns={columns}
                sorting={sorting}
                values={{
                  ...value,
                  date: date.toLocaleDateString("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }),
                }}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DoorCodes(props) {
  const { values } = props;
  const [inside, setInside] = useState();
  const [outside, setOutside] = useState();

  const { t } = useTranslation("info");

  useEffect(() => {
    if (values && values.doorcode) {
      const splitted = values.doorcode
        .replace(" ", "")
        .replace("Außen:", "")
        .replace("Innen:", ",")
        .split(",");
      setOutside(splitted[0]);
      setInside(splitted[1]);
    }
  }, [values]);

  const columns = ["outside", "inside"];

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-xl">{t("doorCodes")}</h1>
      <table className="table-fixed w-full my-2">
        <thead>
          <tr>
            <th className="p-2">
              <ColumnSort value={t("outside")} disabled></ColumnSort>
            </th>
            <th>
              <ColumnSort value={t("inside")} disabled></ColumnSort>
            </th>
          </tr>
        </thead>
        <tbody>
          <Row
            key="doorCodes"
            index={1}
            columns={columns}
            values={{ outside, inside }}
          />
        </tbody>
      </table>
    </div>
  );
}

function Info() {
  const { getLastActiveUsers, getDoorCodes } = useApi();
  const [lastActiveUsers, setLastActiveUsers] = useState();
  const [doorCodes, setDoorCodes] = useState();

  useEffect(() => {
    getLastActiveUsers(setLastActiveUsers);
    getDoorCodes(setDoorCodes);
  }, []); // eslint-disable-line

  return (
    <div className="w-full p-2">
      {doorCodes && (
        <div className="w-full mb-4">
          <DoorCodes values={doorCodes} />
        </div>
      )}
      {lastActiveUsers && (
        <div className="w-full mb-4">
          <LastActiveUsers values={lastActiveUsers} />
        </div>
      )}
    </div>
  );
}

export default Info;
