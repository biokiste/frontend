import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Unlock, Lock } from "react-feather";
import { getEntryBy, updateEntry } from "../../utils/api";
import { useRef } from "react";

function SettingsItem(props) {
  const { title, settingKey: key, editable, token } = props;
  const [fetchedValue, setFetchedValue] = useState("");
  const [value, setValue] = useState("");
  const [locked, setLocked] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    async function getSetting() {
      const data = await getEntryBy(key, "settings", token);
      setFetchedValue(data.value);
    }
    getSetting();
  }, [key]); // eslint-disable-line

  useEffect(() => {
    if (fetchedValue !== value) {
      setValue(fetchedValue);
    }
  }, [fetchedValue]); // eslint-disable-line

  useEffect(() => {
    if (!locked && inputRef.current) {
      inputRef.current.focus();
    }
    if (locked && value !== fetchedValue) {
      async function updateSetting() {
        const { rowsAffected } = await updateEntry(
          key,
          { value },
          "settings",
          token
        );
        if (rowsAffected === 1) {
          setFetchedValue(value);
        }
      }
      updateSetting();
    }
  }, [locked]); // eslint-disable-line

  const handleClick = () => {
    setLocked(!locked);
  };

  const handleChange = evt => {
    setValue(evt.target.value);
  };

  return (
    <div className="w-full border rounded px-4 py-2 flex flex-row items-center">
      <div className="flex flex-row">
        <div
          className={`font-bold truncate w-1/3`}
          data-testid="settings-item-title"
        >
          {title}
        </div>
        <span className="mr-2">:</span>
        <input
          ref={inputRef}
          data-testid="settings-item-value"
          className={`w-2/3 focus:outline-none ${editable && "pr-2"} ${locked &&
            "truncate"}`.trimRight()}
          value={value}
          onChange={handleChange}
          disabled={locked}
        />
      </div>
      {editable && (
        <button
          data-testid="settings-item-toggle"
          className="focus:outline-none hover:opacity-50"
          onClick={handleClick}
        >
          {locked ? <Lock size={20} /> : <Unlock size={20} />}
        </button>
      )}
    </div>
  );
}

SettingsItem.propTypes = {
  title: PropTypes.string.isRequired,
  settingKey: PropTypes.string.isRequired,
  editable: PropTypes.bool,
};

SettingsItem.defaultProps = {
  editable: false,
};

export default SettingsItem;
