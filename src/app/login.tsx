import React from "react";

import {
  AuthFormScreen,
} from "@/features/auth/screens/AuthFormScreen";

export default function LoginRoute() {
  return (
    <AuthFormScreen
      mode="login"
    />
  );
}
