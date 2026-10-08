import {
  Link
} from "react-router";

import "./Button.css";

export default function Button({
  children,
  to,
  type = "button",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) {
  const classes = [
    "app-button",
    `app-button--${variant}`,
    `app-button--${size}`,
    fullWidth
      ? "app-button--full"
      : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}