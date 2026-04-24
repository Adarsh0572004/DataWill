import './Alert.css';

const ICONS = {
  sage: '✓',
  gold: '!',
  rose: '✗',
};

function Alert({ title, children, variant = 'sage', className = '' }) {
  return (
    <div className={`alert alert--${variant} ${className}`}>
      <div className="alert__icon">{ICONS[variant]}</div>
      <div className="alert__body">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__text">{children}</div>
      </div>
    </div>
  );
}

export default Alert;
