import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getEntryBy } from "../../utils/api";

function SmallSettingsItem(props) {
  const { settingKey: key, token, classes } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    async function getValue() {
      const { value: fetchedValue } = await getEntryBy(key, "settings", token);
      setValue(fetchedValue);
    }
    getValue();
  }, [key, token]);

  return (
    <div
      className={`w-full border rounded-lg px-4 py-2 flex flex-row justify-between ${classes}`.trimRight()}
    >
      <div
        className="w-1/3 pr-2 text-left text-sm truncate"
        data-testid="settings-item-key"
      >
        {key}
      </div>
      <div
        className="w-2/3 pl-2 text-right break-words"
        data-testid="settings-item-value"
      >
        {value}
      </div>
    </div>
  );
}

SmallSettingsItem.propTypes = {
  /**
   * Setting Key
   */
  settingKey: PropTypes.string.isRequired,
  /**
   * CSS Classes
   */
  classes: PropTypes.string,
  /**
   * Auth Token
   */
  token: PropTypes.string,
};

SmallSettingsItem.defaultProps = {
  classes: "",
};

export default SmallSettingsItem;
