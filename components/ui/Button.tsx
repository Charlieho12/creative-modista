import Link from "next/link";
import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white hover:bg-black shadow-sm disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "border border-blush-200 bg-white text-ink hover:border-blush-300 hover:bg-blush-50",
  ghost: "text-ink hover:bg-blush-50",
  dark: "bg-white text-ink hover:bg-linen"
};

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, variant = "primary", className } = props;
  const classes = cn(
    "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
    variants[variant],
    className
  );

  if ("href" in props) {
    const { href, children: linkChildren, variant: _variant, className: _className, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {linkChildren}
      </Link>
    );
  }

  const { children: buttonChildren, variant: _variant, className: _className, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {buttonChildren}
    </button>
  );
}
