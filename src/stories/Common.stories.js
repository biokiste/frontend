import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { AlertProvider } from "../components/common/Alert";
import Button from "../components/common/Button";
import { Toolbar, ToolbarItem } from "../components/common/Toolbar";
import { Info, ShoppingCart, Users, DollarSign, Settings } from "react-feather";
import { AlertSeverity } from "../consts";
import { getBackgroundColor, getTextColor } from "../utils/tailwind";

storiesOf("Common|Alert", module)
  .add("with message string", () => {
    return (
      <AlertProvider
        initialState={{
          show: true,
          message: "Alert Message"
        }}
      />
    );
  })
  .add("with severity", () => {
    return (
      <AlertProvider
        initialState={{
          show: true,
          message: "Error Message",
          severity: AlertSeverity.Error
        }}
      />
    );
  })
  .add("with children", () => {
    return (
      <AlertProvider
        initialState={{
          show: true,
          message: (
            <>
              <h1 className="font-bold text-xl">A headline</h1>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua. At vero eos et accusam et
                justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
              </p>
            </>
          )
        }}
      />
    );
  });

storiesOf("Common|Button", module).add("default", () => {
  return <Button value="Ok" onClick={action("onClick")} />;
});

storiesOf("Common|Toolbar", module).add("default", () => {
  return (
    <Toolbar>
      <ToolbarItem icon={<Info />} />
      <ToolbarItem icon={<ShoppingCart />} />
      <ToolbarItem icon={<Users />} />
      <ToolbarItem icon={<DollarSign />} />
      <ToolbarItem icon={<Settings />} />
    </Toolbar>
  );
});

storiesOf("Common|DarkMode", module).add("default", () => {
  return <div className={`fixed w-screen h-screen ${getBackgroundColor("white")} ${getTextColor("black")} flex justify-center items-center`}><p className="text-center">Just change your<br /><span className={`${getTextColor("blue", 800)}`}>Browser or OS Settings</span></p></div>
})
