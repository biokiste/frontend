import React from "react";
import Badge from "../components/Badge";

export default {
  title: "Badge"
};

const name = "story badge";

export const withDefault = () => <Badge>{name}</Badge>;
export const withColor = () => <Badge color="green">{name}</Badge>;
