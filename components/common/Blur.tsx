import React from "react";

const Blur = () => {
  return (
    <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
      {/* orange blur - right */}
      <div className="bg-background-app-blur-bottom-right absolute -right-[50px] -bottom-[50px] z-10 h-[200px] w-[150px] rounded-full opacity-100 blur-[140px]" />
      {/* pink blur - left */}
      <div className="bg-background-app-blur-bottom-left absolute -bottom-[50px] -left-[50px] z-10 h-[200px] w-[150px] rounded-full opacity-100 blur-[140px]" />
    </div>
  );
};

export default Blur;
