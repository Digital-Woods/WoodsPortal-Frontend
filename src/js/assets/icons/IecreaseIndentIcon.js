const IecreaseIndentIcon = ({
    width = "15px",
    height = "15px",
    color = "#e8eaed",
    ...props
  }) => {
  return (
    <svg 
    width={width} height={height} fill={color} {...props}
    xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M120-120v-80h720v80H120Zm320-160v-80h400v80H440Zm0-160v-80h400v80H440Zm0-160v-80h400v80H440ZM120-760v-80h720v80H120Zm0 440v-320l160 160-160 160Z"/></svg>
  )
}
