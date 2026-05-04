function EyeIcon() {
  return (
    <svg
      className="academy-auth-toggle-password-icon"
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="academy-auth-toggle-password-icon"
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.7 2.7" />
      <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
      <path d="M6.6 6.6A13.5 13.5 0 0 0 2 12s3 7 10 7c1.8 0 3.4-.4 4.8-1" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

export function PasswordRevealButton({
  visible,
  onToggle,
  labelShow,
  labelHide,
  disabled,
}: {
  visible: boolean;
  onToggle: () => void;
  labelShow: string;
  labelHide: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="academy-auth-toggle-password"
      onClick={onToggle}
      aria-pressed={visible}
      aria-label={visible ? labelHide : labelShow}
      disabled={disabled}
    >
      {visible ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );
}
