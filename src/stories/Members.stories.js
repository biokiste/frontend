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
  },
  {
    firstname: "R2D2",
    lastname: "C3PO",
    email: "beeboop@yavin.org",
    mobile: "+01 010 1010 1010",
    state: 2,
  },
  {
    firstname: "Leia",
    lastname: "Skywalker",
    email: "princess@alderan.com",
    mobile: "+19 77 1021 1956",
    state: 2,
  },
  {
    firstname: "Han",
    lastname: "Solo",
    email: "han@milleniumfalcon.org",
    mobile: "+19 77 1307 1942",
    state: 3,
  },
];

storiesOf("Members|MembersList", module)
  .add("default", () => {
    return <MembersList categories={categories} />;
  })
  .add("with data", () => {
    return (
      <div className="container mx-auto p-2 flex flex-row flex-wrap">
        <MembersList members={members} categories={categories} />
      </div>
    );
  })
  .add("with search string", () => {
    return (
      <div className="container mx-auto p-2 flex flex-row flex-wrap">
        <MembersList
          members={members}
          categories={categories}
          searchString="Ana"
        />
      </div>
    );
  });

storiesOf("Members|MembersContainer", module).add("default", () => {
  return (
    <div className="container mx-auto p-2 flex flex-row flex-wrap">
      <MembersContainer members={members} />
    </div>
  );
});
