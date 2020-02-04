import React from "react";
import { storiesOf } from "@storybook/react";
import "../i18n";
import MembersList from "../components/members/MembersList";

storiesOf("Members|MembersList", module)
  .add("default", () => {
    return <MembersList />;
  })
  .add("with data", () => {
    const members = [
      {
        firstname: "Anakin",
        lastname: "Skywalker",
        email: "vader@empire.gov",
        mobile: "+49 221 8282 9212",
      },
      {
        firstname: "R2",
        lastname: "D2",
        email: "beeboop@yavin.org",
        mobile: "+01 010 1010 1010",
      },
    ];
    return (
      <div className="container mx-auto p-2 flex flex-row flex-wrap">
        <MembersList members={members} />
      </div>
    );
  });
