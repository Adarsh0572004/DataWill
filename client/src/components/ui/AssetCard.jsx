import Badge from './Badge';
import './AssetCard.css';

const STATUS_MAP = {
  linked:     { label: 'Linked',    variant: 'sage' },
  pending:    { label: 'Pending',   variant: 'gold' },
  'rule-set': { label: 'Rule set',  variant: 'slate' },
  'needs-rule': { label: 'Needs rule', variant: 'rose' },
};

function AssetCard({ name, subtitle, icon = '📦', status = 'linked', onClick, className = '' }) {
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.linked;

  return (
    <div className={`asset-card hover-lift ${className}`} onClick={onClick}>
      <div className="asset-card__icon">{icon}</div>
      <div className="asset-card__info">
        <div className="asset-card__name">{name}</div>
        {subtitle && <div className="asset-card__sub">{subtitle}</div>}
      </div>
      <Badge variant={statusInfo.variant} dot>{statusInfo.label}</Badge>
    </div>
  );
}

export default AssetCard;
