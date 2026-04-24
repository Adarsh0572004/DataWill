import './Card.css';

function Card({ children, variant = 'default', hover = false, className = '', ...props }) {
  const classes = [
    'card',
    `card--${variant}`,
    hover && 'hover-lift',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Card;
