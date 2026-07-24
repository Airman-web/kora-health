interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`font-bold tracking-tight text-[color:var(--color-kora-primary)] ${sizeClasses[size]}`}
      >
        Kora
      </span>
      <span
        className={`inline-block w-2 h-2 rounded-full bg-[color:var(--color-kora-accent)] ${
          size === "sm" ? "w-1.5 h-1.5" : ""
        }`}
      />
      <span
        className={`font-semibold text-[color:var(--color-kora-dark)] ${sizeClasses[size]}`}
      >
        Health
      </span>
    </div>
  );
}