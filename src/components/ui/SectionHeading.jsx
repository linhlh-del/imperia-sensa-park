export default function SectionHeading({
  eyebrow,
  title,
  semanticTitle,
  subtitle,
  light = false,
  center = false,
  className = "",
}) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <div
          className={`eyebrow ${light ? "text-imperia-beige" : ""} ${center ? "justify-center" : ""}`}
        >
          {eyebrow}
        </div>
      )}
      {semanticTitle ? (
        <>
          <h2 className="sr-only">{semanticTitle}</h2>
          <p
            aria-hidden="true"
            className={`section-title ${light ? "section-title-light" : ""}`}
          >
            {title}
          </p>
        </>
      ) : (
        <h2 className={`section-title ${light ? "section-title-light" : ""}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={`section-subtitle ${light ? "section-subtitle-light" : ""} ${center ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
