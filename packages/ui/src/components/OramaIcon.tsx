import React from "react";

export interface OramaIconProps extends React.SVGProps<SVGSVGElement> {
  /** The name of the icon to display */
  theme: "light" | "dark";
  /** The size of the icon (width and height) */
  size?: number | string;
  /** Custom CSS class name */
  className?: string;
}

const OramaIcon: React.FC<OramaIconProps> = ({
  theme,
  size = 24,
  className = "",
  ...props
}) => {
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  if (theme === "dark") {
    return (
      <svg
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <g clipPath="url(#clip0_2002_7415)">
          <path
            d="M16 8C13.7346 10.9943 11.0682 13.6616 8 16C4.99242 13.6768 2.32701 11.0095 0 8C2.33649 4.9545 5.00095 2.28626 8 0C11.0047 2.31943 13.6701 4.98768 16 8Z"
            fill="#F5F5F5"
          />
          <path
            d="M7.99988 3.80664L8.47003 5.07583C8.89088 6.21233 9.78661 7.10901 10.9241 7.52986L12.1932 8.00001L10.9241 8.47015C9.78756 8.891 8.89088 9.78673 8.47003 10.9242L7.99988 12.1934L7.52974 10.9242C7.10889 9.78768 6.21315 8.891 5.07571 8.47015L3.80652 8.00001L5.07571 7.52986C6.21221 7.10901 7.10889 6.21328 7.52974 5.07583L7.99988 3.80664Z"
            fill="black"
          />
        </g>
        <defs>
          <clipPath id="clip0_2002_7415">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  } else {
    return (
      <svg
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <g clipPath="url(#clip0_2002_7415)">
          <path
            d="M16 8C13.7346 10.9943 11.0682 13.6616 8 16C4.99242 13.6768 2.32701 11.0095 0 8C2.33649 4.9545 5.00095 2.28626 8 0C11.0047 2.31943 13.6701 4.98768 16 8Z"
            fill="white"
          />
          <path
            d="M7.99988 3.80664L8.47003 5.07583C8.89088 6.21233 9.78661 7.10901 10.9241 7.52986L12.1932 8.00001L10.9241 8.47015C9.78756 8.891 8.89088 9.78673 8.47003 10.9242L7.99988 12.1934L7.52974 10.9242C7.10889 9.78768 6.21315 8.891 5.07571 8.47015L3.80652 8.00001L5.07571 7.52986C6.21221 7.10901 7.10889 6.21328 7.52974 5.07583L7.99988 3.80664Z"
            fill="black"
          />
        </g>
        <defs>
          <clipPath id="clip0_2002_7415">
            <rect width="16" height="16" fill="F5F5F5" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return null;
};

export default OramaIcon;
