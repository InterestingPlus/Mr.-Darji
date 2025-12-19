import React from "react";

const MrDarjiLogo = ({ size = 40, color = "#FBBF24" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main Body of the Machine */}
      <path
        d="M4 18H20M7 18V16C7 10 9 7 14 7H17V11C17 12 16 13 14 13H10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* The Needle/Stitch Detail */}
      <path
        d="M14 7L14 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* The Digital Pulse / Thread Threading through */}
      <path
        d="M17 7C19 7 21 8.5 21 10.5C21 12.5 19 14 17 14"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      {/* Base Foundation Dot */}
      <circle cx="7" cy="18" r="1" fill={color} />
      <circle cx="20" cy="18" r="1" fill={color} />
    </svg>
  );
};

export default MrDarjiLogo;
