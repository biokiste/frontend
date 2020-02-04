import React from "react";
import { useTranslation } from "react-i18next";

const userDataCategories = ["firstname", "lastname", "email", "mobile"];

function MembersList() {
  const { t } = useTranslation("members");
  return (
    <div className="w-full p-2">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {userDataCategories.map(category => {
              const smCategories = ["firstname", "lastname"];
              const isSmCategory = smCategories.some(k => k === category);
              return (
                <th
                  key={category}
                  className={`px-4 py-2 ${
                    !isSmCategory
                      ? "invisible md:visible"
                      : `w-1/2 md:w-1/${userDataCategories.length}`
                  }`.trimRight()}
                >
                  <div className="flex flex-row justify-center">
                    {t(category)}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
      </table>
    </div>
  );
}

export default MembersList;
