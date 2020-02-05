import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MembersList from "./MembersList";

const userDataCategories = ["firstname", "lastname", "email", "mobile"];

function SearchForm(props) {
  const { children, translationKey, categories = [] } = props;
  const [value, setValue] = useState("");
  const { t } = useTranslation(translationKey);

  const handleChange = evt => {
    setValue(evt.target.value);
  };

  const placeholder = categories.reduce((str, cur, idx) => `${str}${idx > 0 ? ", " : ""}${t(cur)}`, '');

  const elements =
    children &&
    React.Children.toArray(children).map((child, idx, arr) =>
      React.cloneElement(child, {
        searchString: value,
        categories,
      })
    );

  return (
    <>
      <input
        class="appearance-none border rounded-lg w-full mx-2 py-2 px-4 text-gray-700 focus:outline-none truncate"
        onChange={handleChange}
        id="search"
        type="text"
        autocomplete="off"
        placeholder={placeholder}
      />
      {elements}
    </>
  );
}

function MembersContainer(props) {
  const { members } = props;
  return (
    <>
      <SearchForm categories={userDataCategories} translationKey="members">
        <MembersList members={members} />
      </SearchForm>
    </>
  );
}

export default MembersContainer;