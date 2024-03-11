"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function LoginButton() {
  return (
    <Button
      onClick={() => {
        void signIn("google");
      }}
      variant="outline"
      size="lg"
      className="text-center"
    >
      <img
        loading="lazy"
        height="24"
        width="24"
        id="provider-logo"
        className="mr-4"
        src="https://authjs.dev/img/providers/google.svg"
      ></img>
      <p className="text-xl">Sign in with Google</p>
    </Button>
  );
}
