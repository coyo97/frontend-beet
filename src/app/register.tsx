import React from "react";

import {
  AuthFormScreen,
} from "@/features/auth/screens/AuthFormScreen";

export default function RegisterRoute() {
  return (
    <AuthFormScreen
      mode="register"
    />
  );
}
