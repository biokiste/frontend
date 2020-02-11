import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Edit,
  Trash2,
} from "react-feather";
import Fuse from "fuse.js";
import { getTextColor } from "../../utils/tailwind";
import Select from "../common/Select";

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
      <button
        className="focus:outline-none flex flex-row font-bold"
        onClick={handleSort}
      >
        <div className="mr-2">{t(category)}</div>
        {sort > 0 ? <ChevronDown size="24" /> : <ChevronUp size="24" />}
      </button>
    </>
  ) : (
    <button className="focus:outline-none font-bold" onClick={handleSortBy}>
      {t(category)}
    </button>
  );
}

function MemberRow(props) {
  const { index, member, categories, flipped: initialFlipped, onFlip } = props;
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [member]);

  useEffect(() => {
    if (flipped && flipped !== initialFlipped) {
      onFlip && onFlip(index, flipped);
    }
  }, [flipped]); // eslint-disable-line

  useEffect(() => {
    if (initialFlipped !== flipped) {
      setFlipped(initialFlipped);
    }
  }, [initialFlipped]); // eslint-disable-line

  const handleClick = () => {
    setFlipped(!flipped);
  };

  const smCategories = ["firstname", "lastname"];

  return (
    <tr
      className={`cursor-pointer ${index % 2 === 0 ? "bg-gray-100" : ""}`}
      onClick={handleClick}
    >
      {flipped ? (
        <>
          <td className="px-4 py-2 border">
            <Phone className="m-auto" />
          </td>
          <td className="px-4 py-2 border">
            <Mail className="m-auto" />
          </td>
          <td className="px-4 py-2 border invisible md:visible">
            <Edit className="m-auto" />
          </td>
          <td className="px-4 py-2 border invisible md:visible">
            <Trash2 className="m-auto" />
          </td>
        </>
      ) : (
        categories.map(category => {
          const isSmCategory = smCategories.some(k => k === category);
          const inactive = member.state === 6;
          const former = member.state === 4;
          const textColor =
            inactive || former
              ? getTextColor("gray", former && "400")
              : getTextColor("black");
          return (
            <td
              key={category}
              className={`px-4 py-2 border ${textColor} text-center truncate md:w-1/${
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
        })
      )}
    </tr>
  );
}

function MembersList(props) {
  const {
    members = [],
    categories = [],
    groupTypes = [],
    groups = [],
    memberStates = [],
    searchString = "",
  } = props;

  const [sort, setSort] = useState(-1);
  const [sortBy, setSortBy] = useState(categories[0]);
  const [memberFilter, setMemberFilter] = useState(null);
  const [groupFilter, setGroupFilter] = useState(null);
  const [result, setResult] = useState(members);
  const [flippedIndex, setFlippedIndex] = useState(-1);
  const fuse = useRef(null);

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

  useEffect(() => {
    setFlippedIndex(-1);
  }, [sort, sortBy, memberFilter, groupFilter]);

  const handleSort = () => {
    setSort(sort < 0 ? 1 : -1);
  };

  const handleSortBy = category => {
    setSortBy(category);
  };

  const handleMemberFilterChange = type => {
    if (type !== undefined) {
      setMemberFilter(type);
    }
  };

  const handleGroupFilterChange = type => {
    if (type !== undefined) {
      setGroupFilter(type);
    }
  };

  const handleFlip = (index, flipped) => {
    setFlippedIndex(flipped ? index : -1);
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

  const filtered = sorted
    .filter(member => {
      if (memberFilter === "all") {
        return true;
      }
      if (memberFilter === "leaders") {
        const ids = groups.reduce((arr, group) => {
          return arr.concat(group.leader_ids);
        }, []);
        return ids.includes(member.id);
      }
      const { key } = memberStates.find(option => option.id === member.state);
      return key === memberFilter;
    })
    .filter(member => {
      if (groupFilter === "all") {
        return true;
      }
      const { id } = groupTypes.find(item => item.name === groupFilter);
      const { user_ids: userIds, leader_ids: leaderIds } = groups.find(
        item => item.id === id
      );
      return memberFilter === "leaders"
        ? leaderIds.includes(member.id)
        : leaderIds.concat(userIds).includes(member.id);
    });

  const memberStateKeys = memberStates
    .map(option => option.key)
    .concat(["leaders", "all"]);

  const groupTypeKeys = groupTypes.map(option => option.name).concat(["all"]);

  return (
    <div className="w-full p-2">
      <div className="w-full flex flex-wrap flex-row justify-between my-2">
        <Select
          title="Members"
          options={memberStateKeys}
          onChange={handleMemberFilterChange}
          translationKey="members"
          selected="active"
        />
        <Select
          title="Groups"
          options={groupTypeKeys}
          onChange={handleGroupFilterChange}
          translationKey="members"
          selected="all"
        />
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
              <MemberRow
                member={member}
                index={idx}
                categories={categories}
                onFlip={handleFlip}
                flipped={flippedIndex === idx}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MembersList;
