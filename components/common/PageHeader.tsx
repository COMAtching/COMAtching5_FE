"use client";

import { BackButton } from "@/components/ui/BackButton";
import React from "react";

type PageHeaderProps = {
  title?: React.ReactNode;
  sidebar?: React.ReactNode;
};

const PageHeader = ({ title, sidebar }: PageHeaderProps) => {
  return (
    <header className="flex h-[64px] w-full items-center justify-between py-2">
      <BackButton className="shrink-0" />

      {title && (
        <div className="flex flex-1 justify-center text-center">
          {typeof title === "string" ? (
            <span className="typo-20-700 text-color-text-black">{title}</span>
          ) : (
            title
          )}
        </div>
      )}

      <div className="flex shrink-0 items-center justify-end">
        {sidebar ?? null}
      </div>
    </header>
  );
};

export default PageHeader;
