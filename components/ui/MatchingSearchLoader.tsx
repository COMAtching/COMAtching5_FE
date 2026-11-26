import LoaderHeart from "./LoaderHeart";
import styles from "./MatchingSearchLoader.module.css";

export default function MatchingSearchLoader() {
  return (
    <div
      role="status"
      className="flex min-h-[calc(100dvh-env(safe-area-inset-top,0px))] flex-col items-center justify-center gap-8"
    >
      <span aria-hidden="true" className={styles.pulse}>
        <LoaderHeart />
      </span>
      <span className="typo-18-600 text-[#373737]">
        상대를 매칭하는 중이에요
      </span>
    </div>
  );
}
