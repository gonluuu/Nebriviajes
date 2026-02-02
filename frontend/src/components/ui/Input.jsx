import React from "react";

const Input = React.forwardRef(function Input(
  { className = "", ...props },
  ref
) {
  return <input ref={ref} className={className} {...props} />;
});

export default Input;
