import React from "react";
import { storiesOf } from "@storybook/react";
import "../i18n";
import MembersList from "../components/members/MembersList";

storiesOf("Members|MembersList", module)
  .add("default", () => {
    return <MembersList />;
  });
