// Testo spezzato in righe mascherate, animate da RevealAnimations.
export function Lines({ lines, as: Tag = "span", className }: { lines: React.ReactNode[]; as?: "span" | "h1" | "h2" | "h3" | "p"; className?: string }) {
  return (
    <Tag className={className} data-lines>
      {lines.map((l, i) => (
        <span key={i} className="mask">
          <span className="mask__in">{l}</span>
        </span>
      ))}
    </Tag>
  );
}
