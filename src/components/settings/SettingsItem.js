import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Edit } from "react-feather";
import { getEntryBy } from "../../utils/api";

function SettingsItem(props) {
  const { title, settingKey: key, editable, token } = props;
  const [value, setValue] = useState();

  useEffect(() => {
    async function getSetting() {
      const { value } = await getEntryBy(key, "settings", token);
      setValue(value);
    }
    getSetting();
  }, [key]); // eslint-disable-line

  return (
    <div className="w-full border rounded px-4 py-2 flex flex-row items-center">
      <div>
        <span className="font-bold mr-2" data-testid="settings-item-title">
          {title}:
        </span>
        <span data-testid="settings-item-value">{value}</span>
      </div>
      {editable && <Edit size={20} className="ml-8" />}
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
