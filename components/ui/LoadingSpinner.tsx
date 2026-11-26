import LoaderHeart from "./LoaderHeart";
import styles from "./LoadingSpinner.module.css";

const variants = {
  screen: "grid min-h-dvh w-full place-items-center",
  section: "grid w-full flex-1 place-items-center py-10",
  inline: "inline-flex align-middle",
} as const;

export default function LoadingSpinner({
  label,
  variant = "section",
}: {
  label: string;
  variant?: keyof typeof variants;
}) {
  return (
    <span role="status" className={variants[variant]}>
      <span
        className={`${styles.spinner} ${styles[variant]}`}
        aria-hidden="true"
      >
        <LoaderHeart />
        <LoaderHeart />
        <LoaderHeart />
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
