import './StatCard.css';

function StatCard({ value, label, color = '', className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card__value" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

export default StatCard;
