"use client";
import styles from "./LinkButton.module.css";
import Link from "next/link";

export default function LinkButton({
  text,
  href,
  isButton,
  buttonType,
  onClick,
  disabled,
  variant = 'primary',
}) {
  const wrapperClass = `${styles.wrapper} ${variant === 'secondary' ? styles.wrapperSecondary : ''}`;
  const linkClass = `${styles.styledLink} ${variant === 'secondary' ? styles.styledLinkSecondary : ''}`;

  if (isButton) {
    return (
      <div className={wrapperClass}>
        <button
          className={linkClass}
          type={buttonType}
          onClick={onClick}
          disabled={disabled}
        >
          {text}
        </button>
      </div>
    );
  } else {
    return (
      <div className={wrapperClass}>
        <Link className={linkClass} href={href}>
          {text}
        </Link>
      </div>
    );
  }
}
