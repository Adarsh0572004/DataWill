import './RuleCard.css';

const ACTION_MAP = {
  transfer:  { label: '→ Transfer', className: 'rule-action--transfer' },
  delete:    { label: '✕ Delete',   className: 'rule-action--delete' },
  archive:   { label: '◎ Archive',  className: 'rule-action--archive' },
  'schedule-message': { label: '✉ Scheduled', className: 'rule-action--message' },
  memorialize: { label: '♥ Memorialize', className: 'rule-action--transfer' },
};

function RuleCard({ assetName, action = 'transfer', description, onEdit, onDelete, className = '' }) {
  const actionInfo = ACTION_MAP[action] || ACTION_MAP.transfer;

  return (
    <div className={`rule-card ${className}`}>
      <div className="rule-card__head">
        <div className="rule-card__name">{assetName}</div>
        <span className={`rule-action ${actionInfo.className}`}>{actionInfo.label}</span>
      </div>
      {description && <div className="rule-card__desc">{description}</div>}
      {(onEdit || onDelete) && (
        <div className="rule-card__actions">
          {onEdit && <button className="rule-card__btn" onClick={onEdit}>Edit</button>}
          {onDelete && <button className="rule-card__btn rule-card__btn--danger" onClick={onDelete}>Remove</button>}
        </div>
      )}
    </div>
  );
}

export default RuleCard;
