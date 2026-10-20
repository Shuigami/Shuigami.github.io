export function ArrowIcon({ className = "" }) {
  return <svg className={`arrow-icon ${className}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg>;
}

export function ExpandIcon() {
  return <svg className="arrow-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true" focusable="false"><path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4" /></svg>;
}
