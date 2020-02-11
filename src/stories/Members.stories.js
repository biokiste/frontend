import React from "react";
import { storiesOf } from "@storybook/react";
import "../i18n";
import MembersList from "../components/members/MembersList";
import MembersContainer from "../components/members/MembersContainer";

const categories = ["firstname", "lastname", "email", "mobile"];

const members = [
  {
    firstname: "Anakin",
    lastname: "Skywalker",
    email: "vader@empire.gov",
    mobile: "+49 221 8282 9212",
    state: 4,
    group_id: 6,
  },
  {
    firstname: "R2D2",
    lastname: "C3PO",
    email: "beeboop@yavin.org",
    mobile: "+01 010 1010 1010",
    state: 2,
    group_id: 4,
  },
  {
    firstname: "Leia",
    lastname: "Skywalker",
    email: "princess@alderan.com",
    mobile: "+19 77 1021 1956",
    state: 2,
    group_id: 4,
  },
  {
    firstname: "Han",
    lastname: "Solo",
    email: "han@milleniumfalcon.org",
    mobile: "+19 77 1307 1942",
    state: 6,
    group_id: 13,
  },
];

const memberStates = [
  { id: 1, key: "new" },
  { id: 2, key: "active" },
  { id: 3, key: "blocked" },
  { id: 4, key: "former" },
  { id: 5, key: "deleted" },
  { id: 6, key: "paused" },
];

const teams = [
  {
    id: 2,
    name: "finance",
  },
  {
    id: 4,
    name: "purchase",
  },
  {
    id: 6,
    name: "web",
  },
  {
    id: 13,
    name: "none",
  },
];

storiesOf("Members|MembersList", module)
  .add("default", () => {
    return <MembersList categories={categories} memberStates={memberStates} teams={teams} />;
  })
  .add("with data", () => {
    return (
      <div className="container mx-auto p-2 flex flex-row flex-wrap">
        <MembersList
          members={members}
          teams={teams}
          categories={categories}
          memberStates={memberStates}
        />
      </div>
    );
  })
  .add("with search string", () => {
    return (
      <div className="container mx-auto p-2 flex flex-row flex-wrap">
        <MembersList
          members={members}
          teams={teams}
          categories={categories}
          memberStates={memberStates}
          searchString="Ana"
        />
      </div>
    );
  });

storiesOf("Members|MembersContainer", module).add("default", () => {
  return (
    <div className="container mx-auto p-2 flex flex-row flex-wrap">
      <MembersContainer
        members={members}
        memberStates={memberStates}
        teams={teams}
      />
    </div>
  );
});
