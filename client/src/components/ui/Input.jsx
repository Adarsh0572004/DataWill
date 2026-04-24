import './Input.css';

function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  hint,
  error,
  id,
  name,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-group__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        className={`input-group__input ${error ? 'input-group__input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && <div className="input-group__hint input-group__hint--error">{error}</div>}
      {hint && !error && <div className="input-group__hint">{hint}</div>}
    </div>
  );
}

export default Input;
