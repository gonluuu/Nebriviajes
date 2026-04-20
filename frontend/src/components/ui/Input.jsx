import React from "react";

function Input(props) {
  return (
    <input
      className={props.className || ""}
      {...props}
    />
  );
}

export default Input;