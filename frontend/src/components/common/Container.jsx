import "./Container.css";

export default function Container({
  children,
  className = ""
}) {
  const classes = [
    "app-container",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {children}
    </div>
  );
}