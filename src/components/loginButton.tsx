"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";

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
      <Image
        loading="lazy"
        height="24"
        width="24"
        id="provider-logo"
        className="mr-4"
        alt="google logo"
        src="https://authjs.dev/img/providers/google.svg"
      ></Image>
      <p className="text-xl">Sign in with Google</p>
    </Button>
  );
}
