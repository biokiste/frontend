import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "react-feather";

const userDataCategories = ["firstname", "lastname", "email", "mobile"];

function CategoryHeader(props) {
  const {
    category,
    sortBy,
    sort,
    onChangeSort,
    onChangeSortBy,
    translationKey,
  } = props;

  const { t } = useTranslation(translationKey);

  const handleSort = () => {
    onChangeSort && onChangeSort();
  };

  const handleSortBy = () => {
    onChangeSortBy && onChangeSortBy(category);
  };

  console.log("sortBy", sortBy, "category", category);

  return sortBy === category ? (
    <>
      {t(category)}
      <button className="focus:outline-none ml-2" onClick={handleSort}>
        {sort > 0 ? <ChevronDown size="24" /> : <ChevronUp size="24" />}
      </button>
    </>
  ) : (
    <button className="focus:outline-none font-bold" onClick={handleSortBy}>
      {t(category)}
    </button>
  );
}

function MembersList(props) {
  const { members = [] } = props;

  const [sort, setSort] = useState(1);
  const [sortBy, setSortBy] = useState(userDataCategories[0]);

  useEffect(() => {
    setSort(1);
  }, [sortBy]);

  useEffect(() => {
    setSortBy(userDataCategories[0]);
  }, []);

  const handleSort = () => {
    setSort(sort < 0 ? 1 : -1);
  };

  const handleSortBy = category => {
    setSortBy(category);
  };

  const smCategories = ["firstname", "lastname"];

  const sorted = members.sort((a, b) => {
    const category = userDataCategories.find(k => k === sortBy);

    if (!category) {
      return 0;
    }

    const valA = sort < 0 ? a[sortBy] : b[sortBy];
    const valB = sort < 0 ? b[sortBy] : a[sortBy];

    if (valA instanceof Date && valB instanceof Date) {
      return new Date(valA) - new Date(valB);
    } else if (typeof valA === "string" && typeof valB === "string") {
      return valA.localeCompare(valB);
    }
    return (valA || 0) - (valB || 0);
  });

  return (
    <div className="w-full p-2">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {userDataCategories.map(category => {
              const isSmCategory = smCategories.some(k => k === category);
              return (
                <th
                  key={category}
                  className={`${
                    !isSmCategory
                      ? "invisible md:visible"
                      : `w-1/${smCategories.length} md:w-1/${userDataCategories.length} px-4 py-2`
                  }`}
                >
                  <div className="flex flex-row justify-center truncate">
                    <CategoryHeader
                      category={category}
                      sortBy={sortBy}
                      sort={sort}
                      onChangeSort={handleSort}
                      onChangeSortBy={handleSortBy}
                      translationKey="members"
                    />
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((member, idx) => {
            return (
              <tr
                key={`members-${idx}`}
                className={idx % 2 === 0 ? "bg-gray-100" : ""}
              >
                {userDataCategories.map(category => {
                  const isSmCategory = smCategories.some(k => k === category);
                  return (
                    <td
                      key={category}
                      className={`border px-4 py-2 text-center truncate md:w-1/${
                        userDataCategories.length
                      } ${
                        !isSmCategory
                          ? "invisible md:visible"
                          : `w-1/${smCategories.length}`
                      }`.trimRight()}
                    >
                      {member[category]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MembersList;
