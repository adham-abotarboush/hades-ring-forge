import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function RealmDoor({
  to,
  color,
  icon,
  eyebrow,
  label,
}: {
  to: string;
  color: string;
  icon: string;
  eyebrow: string;
  label: string;
}) {
  return (
    <Link to={to} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <div
        className="relative flex min-h-[4.5rem] items-center gap-4 overflow-hidden rounded-xl border p-4 transition-[box-shadow,border-color] duration-300 hover-lift sm:min-h-0 sm:p-5"
        style={{ borderColor: `${color}33` }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${color}99`;
          e.currentTarget.style.boxShadow = `0 12px 40px -12px ${color}55`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${color}33`;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: `linear-gradient(135deg, transparent, ${color}22)` }}
        />
        <div className="relative z-10 flex w-full items-center gap-4">
          <span className="shrink-0 text-3xl drop-shadow-[0_0_8px_currentColor]" style={{ color }}>
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color, opacity: 0.85 }}>
              {eyebrow}
            </p>
            <p className="font-heading text-base font-semibold tracking-tight md:text-lg">{label}</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform motion-safe:md:group-hover:translate-x-1" style={{ color }} />
        </div>
      </div>
    </Link>
  );
}
