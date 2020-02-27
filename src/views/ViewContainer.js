import React from "react";
import { AlertProvider } from "../components/common/Alert";

function ViewContainer(props) {
  const { children } = props;
  return (
    <AlertProvider>
      <div className="container mx-auto p-2 sm:pl-20 landscape:pl-20 xl:pl-2 flex flex-row flex-wrap">
        {children}
      </div>
    </AlertProvider>
  );
}

export default ViewContainer;
