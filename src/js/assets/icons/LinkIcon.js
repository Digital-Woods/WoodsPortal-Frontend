const LinkIcon = ({
    width = "15px",
    height = "15px",
    color = "#e8eaed",
    ...props
  }) => {
  return (
    <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22.000000 34.000000"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}
    fill={color}
    {...props}
  >
    <g
      transform="translate(0.000000,34.000000) scale(0.100000,-0.100000)"
      stroke="none"
    >
      <path
        d="M56 275 c-12 -33 -7 -85 9 -85 11 0 15 11 15 41 0 39 1 40 33 37 29
-3 32 -6 35 -40 5 -56 24 -46 20 10 l-3 47 -51 3 c-40 2 -53 -1 -58 -13z"
      />
      <path
        d="M102 169 c4 -79 23 -81 23 -2 0 37 -4 58 -13 61 -10 3 -12 -11 -10
-59z"
      />
      <path
        d="M56 143 c-12 -12 -6 -81 8 -92 8 -7 34 -11 58 -9 l43 3 3 53 c2 31
-1 52 -7 52 -6 0 -11 -18 -11 -40 0 -39 -1 -40 -35 -40 -33 0 -35 2 -35 34 0
34 -11 52 -24 39z"
      />
    </g>
  </svg>
  )
}
