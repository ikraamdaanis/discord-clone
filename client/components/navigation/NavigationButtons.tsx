"use client";

import { ActionTooltip } from "components/ActionTooltip";
import { CreateServerModal } from "features/server/components/CreateServerModal";
import { Plus } from "lucide-react";
import { useState } from "react";

/** Buttons in the navigation sidebar. */
export const NavigationButtons = () => {
  const [modal, setModal] = useState("");

  return (
    <>
      <div>
        <ActionTooltip side="right" align="center" label="Add a Server">
          <button
            className="group flex items-center"
            onClick={() => setModal("createServer")}
          >
            <div className="mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background bg-neutral-700 transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500">
              <Plus
                className="text-emerald-500 transition group-hover:text-white"
                size={25}
              />
            </div>
          </button>
        </ActionTooltip>
      </div>
      <CreateServerModal
        isOpen={modal === "createServer"}
        onClose={() => setModal("")}
      />
    </>
  );
};
