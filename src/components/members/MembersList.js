import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  Edit,
  DollarSign,
} from "react-feather";
import Fuse from "fuse.js";
import { getTextColor } from "../../utils/tailwind";
import Select from "../common/Select";
import ColumnSort from "../table/ColumnSort";

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
    if (!flipped) {
      const selection = window.getSelection().toString();
      if (selection.length > 0) {
        return;
      }
    }
    setFlipped(!flipped);
  };

  const smCategories = ["firstname", "lastname"];

  return (
    <tr
      className={`cursor-pointer border h-12 ${
        index % 2 === 0 ? "bg-gray-100" : ""
      }`}
      onClick={handleClick}
    >
      {flipped ? (
        <>
          <td className="border-0 text-center">
            <a
              href={`tel:${member.mobile}`}
              onClick={evt => evt.stopPropagation()}
            >
              <Phone className="inline" />
            </a>
          </td>
          <td className="border-r md:border-0 text-center">
            <a
              href={`mailto:${member.email}`}
              onClick={evt => evt.stopPropagation()}
            >
              <Mail className="inline" />
            </a>
          </td>
          <td className="border-0 text-center invisible md:visible">
            <DollarSign className="inline" />
          </td>
          <td className="border-0 text-center invisible md:visible">
            <Edit className="inline" />
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
              <span
                className="cursor-text"
                onClick={evt => evt.stopPropagation()}
              >
                {member[category]}
              </span>
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
      if (memberFilter === "leading") {
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
      return memberFilter === "leading"
        ? leaderIds.includes(member.id)
        : leaderIds.concat(userIds).includes(member.id);
    });

  const memberStateKeys = memberStates
    .map(option => option.key)
    .concat(["leading", "all"]);

  const groupTypeKeys = groupTypes.map(option => option.name).concat(["all"]);

  return (
    <div className="w-full p-2">
      <div className="w-full flex flex-wrap flex-row justify-between my-2">
        <div className="w-1/2 sm:w-auto pr-1">
          <Select
            title="Member"
            options={memberStateKeys}
            onChange={handleMemberFilterChange}
            translationKey="members"
            selected="active"
          />
        </div>
        <div className="w-1/2 sm:w-auto pl-1">
          <Select
            title="Group"
            options={groupTypeKeys}
            onChange={handleGroupFilterChange}
            translationKey="members"
            selected="all"
          />
        </div>
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
                    <ColumnSort
                      value={category}
                      title={t(category)}
                      sortKey={sortBy}
                      direction={sort}
                      onActive={handleSortBy}
                      onDirection={handleSort}
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
