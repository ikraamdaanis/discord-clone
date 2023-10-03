import { redirectToSignIn } from "@clerk/nextjs";
import { CompleteProfileForm } from "features/profile/components/CompleteProfileForm";
import { currentProfile } from "features/profile/utils/currentProfile";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Complete your Profile | Discourse"
};

const CompleteProfilePage = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <CompleteProfileForm profile={profile} />
    </div>
  );
};

export default CompleteProfilePage;
