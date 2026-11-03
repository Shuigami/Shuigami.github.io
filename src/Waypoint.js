export default function Waypoint({ number, label, className = "" }) {
  return <p className={`waypoint ${className}`.trim()}>
    <span className="waypoint-number">{number}</span>
    <span className="waypoint-rule" aria-hidden="true" />
    <span className="waypoint-label">{label}</span>
  </p>;
}
