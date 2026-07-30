import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  variant?: "full" | "mark";
  className?: string;
}

const sizeMap = {
  sm: { w: 96, h: 32 },
  md: { w: 140, h: 46 },
  lg: { w: 200, h: 66 },
};

export function Logo({
  size = "md",
  href = "/",
  variant = "full",
  className = "",
}: LogoProps) {
  const { w, h } = sizeMap[size];

  const image = (
    <Image
      src="/images/kora-logo.png"
      alt="Kora Health Physiotherapy"
      width={w}
      height={h}
      priority
      className="object-contain"
      style={{ height: "auto", width: "auto", maxHeight: h, maxWidth: w }}
    />
  );

  if (href) {
    return (
      <Link href={href} className={`inline-flex items-center ${className}`}>
        {image}
      </Link>
    );
  }
  return <div className={`inline-flex items-center ${className}`}>{image}</div>;
}
