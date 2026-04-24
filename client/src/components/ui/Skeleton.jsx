import './Skeleton.css';

function Skeleton({ width = '100%', height = '16px', radius = 'var(--r-sm)', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export default Skeleton;
