export default function LoaderHeart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 21 3.5 12.7C-2 7.1 5.6.2 10.5 5.1L12 6.6l1.5-1.5c5-4.9 12.5 2 7 7.6z"
      />
    </svg>
  );
}
