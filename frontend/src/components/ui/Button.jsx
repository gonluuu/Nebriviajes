function Button(props) {
  return (
    <button
      type={props.type || "button"}
      disabled={props.disabled || false}
      className={props.className || ""}
      {...props}
    >
      {props.children}
    </button>
  );
}

export default Button;