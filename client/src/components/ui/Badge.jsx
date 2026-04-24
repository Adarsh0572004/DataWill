import './Badge.css';

function Badge({ children, variant = 'sage', dot = false, className = '' }) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {dot && <span className="badge__dot"></span>}
      {children}
    </span>
  );
}

export default Badge;
