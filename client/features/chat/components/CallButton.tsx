"use client";

import { ActionTooltip } from "components/ActionTooltip";
import { Phone, PhoneCall } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

/** Button to start a video/audio call in a direct conversation. */
export const CallButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true
        }
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const Icon = isVideo ? PhoneCall : Phone;
  const tooltipLabel = isVideo ? "End call" : "Start call";

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="mr-4 transition hover:opacity-75">
        <Icon className="h-6 w-6 text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
