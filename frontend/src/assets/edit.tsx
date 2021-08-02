import React from "react";

export interface IconProps {
  width?: string;
  height?: string;
  color?: string;
}

export default function EditIcon(props: IconProps): JSX.Element {
  const { width, height, color } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || "14"}
      height={height || "14"}
      viewBox="0 0 14 14"
    >
      <g
        id="Edit_Icon"
        data-name="Edit Icon"
        transform="translate(-160.881 -73.57)"
      >
        <path
          id="Path_10170"
          data-name="Path 10170"
          d="M13.615-7.489a1.31,1.31,0,0,0,0-1.857L11.972-10.99a1.315,1.315,0,0,0-1.857,0L8.854-9.729a.328.328,0,0,0,0,.465L11.89-6.229a.328.328,0,0,0,.465,0ZM7.771-8.646.591-1.465.011,1.857a.657.657,0,0,0,.76.76l3.322-.582,7.181-7.181a.328.328,0,0,0,0-.465L8.239-8.646A.332.332,0,0,0,7.771-8.646ZM3.393-2.081a.381.381,0,0,1,0-.541L7.6-6.833a.381.381,0,0,1,.541,0,.381.381,0,0,1,0,.541L3.935-2.081A.381.381,0,0,1,3.393-2.081ZM2.406.219H3.719v.993l-1.764.309L1.1.67l.309-1.764h.993Z"
          transform="translate(160.88 84.943)"
          fill={color || "#111"}
        />
      </g>
    </svg>
  );
}
