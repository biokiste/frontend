import React, { useRef } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import { useTranslation } from "react-i18next";

function Login(props) {
  const { onSubmit, onReset } = props;
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const { t } = useTranslation("auth");

  const handleSubmit = () => {
    if (emailInput.current && passwordInput.current) {
      onSubmit &&
        onSubmit({
          email: emailInput.current.value,
          password: passwordInput.current.value,
        });
    }
  };
  const handleReset = () => {
    onReset && onReset();
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <h1 className="text-xl">{t("Login")}</h1>
      <div className="w-full my-4 flex flex-col">
        <input
          ref={emailInput}
          className="border rounded mb-2 px-4 py-2"
          placeholder={t("Email")}
          type="email"
        />
        <input
          ref={passwordInput}
          className="border rounded px-4 py-2"
          placeholder={t("Password")}
          type="password"
        />
      </div>
      <div className="w-full flex flex-col md:flex-row-reverse">
        <Button
          value={t("submit")}
          color="green"
          onClick={handleSubmit}
          classes="mb-2 md:mb-0 md:ml-2"
        />
        <Button
          value={t("reset")}
          color="gray"
          onClick={handleReset}
          classes="mt-2 md:mt-0"
        />
      </div>
    </div>
  );
}

Login.propTypes = {
  /** Submit handler */
  onSubmit: PropTypes.func,
  /** Password reset handler */
  onReset: PropTypes.func,
};

export default Login;
