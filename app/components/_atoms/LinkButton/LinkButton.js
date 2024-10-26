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
}) {
  if (isButton) {
    return (
      <div className={styles.wrapper}>
        <button
          className={styles.styledLink}
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
      <div className={styles.wrapper}>
        <Link className={styles.styledLink} href={href}>
          {text}
        </Link>
      </div>
    );
  }
}
