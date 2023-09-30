import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Discourse"
};

export default function Page() {
  return <SignUp />;
}
