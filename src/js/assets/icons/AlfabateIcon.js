const AlfabateIcon = ({
    width = "15px",
    height = "15px",
    color = "#e8eaed",
    ...props
  }) => {
  return (
    <svg
    width={width}
    height={height}
    fill={color}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
  >
    <path
      d="M80 0v-160h800V0H80Z"
      fill={color}
      id="text-color-svg"
    />
    <path
      d="M220-280 430-840h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"
      fill={color}
    />
  </svg>
  )
}
