import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "react-feather";
import Fuse from "fuse.js";
import { getTextColor } from "../../utils/tailwind";

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
  const { members = [], categories = [], searchString = "" } = props;

  const [sort, setSort] = useState(-1);
  const [sortBy, setSortBy] = useState(categories[0]);
  const [hideInactive, setHideInactive] = useState(true);
  const [hideFormer, setHideFormer] = useState(true);
  const [result, setResult] = useState(members);
  const fuse = useRef(null);

  const { t } = useTranslation("members");

  useEffect(() => {
    setSort(-1);
  }, [sortBy]);

  useEffect(() => {
    setSortBy(categories[0]);
  }, [categories]);

  useEffect(() => {
    if (members.length > 0) {
      fuse.current = new Fuse(members, {
        keys: categories,
        minMatchCharLength: 2,
      });
    }
  }, [members, categories]);

  useEffect(() => {
    if (searchString !== "" && fuse.current !== null && members.length > 0) {
      const result = fuse.current.search(searchString);
      setResult(result);
    } else if (result.length !== members.length) {
      setResult(members);
    }
  }, [searchString, members]); // eslint-disable-line

  const handleSort = () => {
    setSort(sort < 0 ? 1 : -1);
  };

  const handleSortBy = category => {
    setSortBy(category);
  };

  const handleInactive = () => {
    setHideInactive(!hideInactive);
  };

  const handleFormer = () => {
    setHideFormer(!hideFormer);
  };

  const smCategories = ["firstname", "lastname"];

  const sorted = result.sort((a, b) => {
    const category = categories.find(k => k === sortBy);

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

  const filtered = sorted.filter(member => {
    const inactive = member.state === 3;
    const former = member.state === 4;
    if ((hideInactive && inactive) || (hideFormer && former)) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full p-2">
      <div className="w-full flex flex-wrap flex-row justify-around my-2">
        <button
          className="w-full sm:w-1/2 flex justify-center items-center focus:outline-none"
          onClick={handleInactive}
        >
          <input
            className="mr-2 pointer-events-none"
            type="checkbox"
            name="hide inactive"
            checked={hideInactive}
          />
          <label className="pointer-events-none" for="hide inactive">
            {t("hide inactive")}
          </label>
        </button>
        <button
          className="w-full sm:w-1/2 flex justify-center items-center focus:outline-none"
          onClick={handleFormer}
        >
          <input
            className="mr-2 pointer-events-none"
            type="checkbox"
            name="hide former"
            checked={hideFormer}
          />
          <label className="pointer-events-none" for="hide former">
            {t("hide former")}
          </label>
        </button>
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            {categories.map(category => {
              const isSmCategory = smCategories.some(k => k === category);
              return (
                <th
                  key={category}
                  className={`${
                    !isSmCategory
                      ? "invisible md:visible"
                      : `w-1/${smCategories.length} md:w-1/${categories.length} px-4 py-2`
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
          {filtered.map((member, idx) => {
            return (
              <tr
                key={`members-${idx}`}
                className={idx % 2 === 0 ? "bg-gray-100" : ""}
              >
                {categories.map(category => {
                  const isSmCategory = smCategories.some(k => k === category);
                  const inactive = member.state === 3;
                  const former = member.state === 4;
                  const textColor =
                    inactive || former
                      ? getTextColor("gray", former && "400")
                      : getTextColor("black");
                  return (
                    <td
                      key={category}
                      className={`border px-4 py-2 ${textColor} text-center truncate md:w-1/${
                        categories.length
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
