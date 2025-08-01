export const CautionCircle=({width='80px', height='80px', ...props}: any)=> {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={width}
      height={height}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="7" cy="7" r="6.5"></circle>
        <path d="M7 3.5v3"></path>
        <circle cx="7" cy="9.5" r=".5"></circle>
      </g>
    </svg>
  )
}
