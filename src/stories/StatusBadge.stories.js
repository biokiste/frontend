import React from "react";
import StatusBadge from "../components/StatusBadge";

export default {
  title: "StatusBadge"
};

const name = "backend";

export const withName = () => <StatusBadge name={name} />;
export const withRequest = () => <StatusBadge name={name} status="calling" />;
export const withOk = () => <StatusBadge name={name} status="success" />;
export const withError = () => <StatusBadge name={name} status="error" />;
