import styles from "./MatchingSearchLoader.module.css";

const profileColors = [
  "text-blue-200",
  "text-emerald-200",
  "text-amber-200",
  "text-purple-200",
  "text-rose-200",
];

export default function MatchingSearchLoader() {
  return (
    <div
      role="status"
      className="flex min-h-[calc(100dvh-env(safe-area-inset-top,0px))] w-full min-w-0 flex-col items-center justify-center gap-8"
    >
      <span className="typo-18-600 text-[#373737]">
        상대를 매칭하는 중이에요
      </span>
      <div aria-hidden="true" className={styles.window}>
        <div className={styles.film}>
          {profileColors.map((color, index) => (
            <div className={styles.card} key={color}>
              <svg
                className={color}
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="currentColor"
                opacity=".8"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              {index === 2 && (
                <svg
                  className={styles.stamp}
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="43"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    opacity=".8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity=".6"
                  />
                  <path d="M50 69 C46 65 28 54 28 42 C28 30 42 25 50 36 C58 25 72 30 72 42 C72 54 54 65 50 69 Z" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
