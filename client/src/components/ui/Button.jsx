import './Button.css';

function Button({
  children,
  variant = 'primary',
  size = '',
  full = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size && `btn--${size}`,
    full && 'btn--full',
    className,
  ].filter(Boolean).join(' ');

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

export default Button;
