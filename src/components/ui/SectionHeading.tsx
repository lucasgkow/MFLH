export function SectionHeading({
  eyebrow,
  title,
  className = ""
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl">
        {title}
      </h2>
    </div>
  );
}
