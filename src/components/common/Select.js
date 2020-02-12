import React, { useState, useEffect } from "react";
import { ChevronDown } from "react-feather";
import { useTranslation } from "react-i18next";

function Select(props) {
  const { title, options, selected, onChange, translationKey } = props;
  const [current, setCurrent] = useState(options[0]);
  const { t } = useTranslation(translationKey);

  const handleChange = evt => {
    setCurrent(evt.target.value);
  };

  useEffect(() => {
    if (selected) {
      setCurrent(selected);
    }
  }, [selected]);

  useEffect(() => {
    onChange && onChange(current);
  }, [current, onChange]);

  return (
    <>
      <div className="relative w-full border border-gray-500 rounded-lg flex flex-row items-center">
        <select
          className="w-full pl-4 pr-10 py-2 bg-transparent appearance-none focus:outline-none"
          onChange={handleChange}
          value={current}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {t(`${option}${title}`)}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 mr-2"
          size="24"
        />
      </div>
    </>
  );
}

export default Select;
