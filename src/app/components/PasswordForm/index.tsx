import {
  HiddenIcon,
  VisibleIcon,
} from "@bitcoin-design/bitcoin-icons-react/outline";
import TextField from "@components/form/TextField";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export type Props = {
  i18nKeyPrefix: string;
  children?: React.ReactNode;
  formData: {
    password: string;
    passwordConfirmation: string;
  };
  setFormData: (formData: {
    password: string;
    passwordConfirmation: string;
  }) => void;
};

const initialErrors = {
  passwordErrorMessage: "",
  passwordConfirmationErrorMessage: "",
};

export default function PasswordForm({
  formData,
  setFormData,
  i18nKeyPrefix,
}: Props) {
  const [errors, setErrors] = useState(initialErrors);
  const [passwordView, setPasswordView] = useState(false);
  const [passwordConfirmationView, setPasswordConfirmationView] =
    useState(false);
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (
      event.target.name === "password" ||
      event.target.name === "passwordConfirmation"
    ) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value.trim(),
      });
    }

    if (event.target.name === "password" && errors.passwordErrorMessage) {
      setErrors({ ...errors, passwordErrorMessage: "" });
    } else if (
      event.target.name === "passwordConfirmation" &&
      errors.passwordConfirmationErrorMessage &&
      formData.password === event.target.value.trim()
    ) {
      setErrors({ ...errors, passwordConfirmationErrorMessage: "" });
    }
  }

  function validate() {
    let passwordErrorMessage = "";
    let passwordConfirmationErrorMessage = "";

    if (!formData.password) passwordErrorMessage = "enter_password";
    if (!formData.passwordConfirmation) {
      passwordConfirmationErrorMessage = "confirm_password";
    } else if (formData.password !== formData.passwordConfirmation) {
      passwordConfirmationErrorMessage = "mismatched_password";
    }
    setErrors({
      passwordErrorMessage,
      passwordConfirmationErrorMessage,
    });
  }

  return (
    <>
      <div className="w-full mb-6">
        <TextField
          autoFocus
          id="password"
          label={t("choose_password_label")}
          type={passwordView ? "text" : "password"}
          required
          onChange={handleChange}
          endAdornment={
            <button
              type="button"
              className="flex justify-center items-center w-10 h-8"
              onClick={() => {
                setPasswordView(!passwordView);
              }}
            >
              {passwordView ? (
                <HiddenIcon className="h-6 w-6" />
              ) : (
                <VisibleIcon className="h-6 w-6" />
              )}
            </button>
          }
        />
        {errors.passwordErrorMessage && (
          <p className="mt-1 text-red-500">{t(errors.passwordErrorMessage)}</p>
        )}
      </div>
      <div className="w-full">
        <TextField
          id="passwordConfirmation"
          label={t("confirm_password_label")}
          type={passwordConfirmationView ? "text" : "password"}
          required
          onChange={handleChange}
          onBlur={validate}
          endAdornment={
            <button
              type="button"
              className="flex justify-center items-center w-10 h-8"
              onClick={() =>
                setPasswordConfirmationView(!passwordConfirmationView)
              }
            >
              {passwordConfirmationView ? (
                <HiddenIcon className="h-6 w-6" />
              ) : (
                <VisibleIcon className="h-6 w-6" />
              )}
            </button>
          }
        />
        {errors.passwordConfirmationErrorMessage && (
          <p className="mt-1 text-red-500">
            {t(errors.passwordConfirmationErrorMessage)}
          </p>
        )}
      </div>
    </>
  );
}
