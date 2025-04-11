const HighlightIcon = ({
    width = "15px",
    height = "15px",
    color = "#e8eaed",
    id="text-bg-color-svg",
    ...props
  }) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width={width}
    height={height}
    {...props}
  >
    <path
      d="M80 0v-160h800V0H80Z"
      fill={color}
      id={id}
    />
    <path
      d="M160-320h56l312-311-29-29-28-28-311 312v56Z"
      fill="#666666"
    />
    <path
      d="M80-240v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Z"
      fill="#666666"
    />
    <path d="M720-744l-56-56 56 56Z" fill="#666666" />
    <path d="M608-631l-29-29-28-28 57 57Z" fill="#666666" />
  </svg>
  )
}
