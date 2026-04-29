import { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-7 max-w-3xl">
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blush-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-4xl">
        {title}
      </h2>
      {children ? <div className="mt-3 text-sm leading-7 text-neutral-600">{children}</div> : null}
    </div>
  );
}
