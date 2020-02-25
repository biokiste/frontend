import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import { useTranslation } from "react-i18next";

function isValidEmail(value) {
  return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    value
  );
}

function Login(props) {
  const { onSubmit, onReset } = props;
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const { t } = useTranslation("auth");

  const handleSubmit = () => {
    if (emailInput.current && passwordInput.current) {
      let invalid = false;
      if (!isValidEmail(emailInput.current.value)) {
        setEmailInvalid(true);
        invalid = true;
      }
      if (passwordInput.current.value === "") {
        setPasswordInvalid(true);
        invalid = true;
      }
      if (!invalid) {
        onSubmit &&
          onSubmit({
            email: emailInput.current.value,
            password: passwordInput.current.value,
          });
      }
    }
  };

  const handleReset = () => {
    if (emailInput.current) {
      if (!isValidEmail(emailInput.current.value)) {
        setEmailInvalid(true);
      } else {
        onReset && onReset({ email: emailInput.current.value });
      }
    }
  };

  const handleChange = evt => {
    if (evt.target === emailInput.current && emailInvalid) {
      setEmailInvalid(false);
    }
    if (evt.target === passwordInput.current && passwordInvalid) {
      setPasswordInvalid(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <h1 className="text-xl">{t("Login")}</h1>
      <div className="w-full my-4 flex flex-col">
        <input
          ref={emailInput}
          className={`border rounded mb-2 px-4 py-2 focus:outline-none ${
            emailInvalid ? "border-red-500" : ""
          }`.trimRight()}
          placeholder={t("Email")}
          type="email"
          onChange={handleChange}
        />
        <input
          ref={passwordInput}
          className={`border rounded px-4 py-2 focus:outline-none ${
            passwordInvalid ? "border-red-500" : ""
          }`.trimRight()}
          placeholder={t("Password")}
          type="password"
          onChange={handleChange}
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
