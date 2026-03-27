import React from "react";

const Blur = () => {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 mx-auto h-dvh w-full overflow-hidden md:max-w-[430px]">
      {/* orange blur - right */}
      <div className="bg-background-app-blur-bottom-right absolute -right-[50px] -bottom-[50px] z-10 h-[200px] w-[150px] rounded-full opacity-100 blur-[140px]" />
      {/* pink blur - left */}
      <div className="bg-background-app-blur-bottom-left absolute -bottom-[50px] -left-[50px] z-10 h-[200px] w-[150px] rounded-full opacity-100 blur-[140px]" />
    </div>
  );
};

export default Blur;
