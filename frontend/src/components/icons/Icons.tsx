// how to use: <CartIcon size={24} /> or <CartIcon className="cart-icon" />
// Icons are labeled by default for accessibility; pass aria-hidden="true"
// to override when used purely decoratively next to visible text.

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
  }
  
  export function CartIcon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Shopping cart"
        {...props}
      >
        <path d="M3 4h2l.6 3"/><path d="M6.5 7h14l-1.9 7.6a1.5 1.5 0 0 1-1.45 1.15H9.3a1.5 1.5 0 0 1-1.45-1.15L6.5 7z"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>
      </svg>
    );
  }
  
  export function OrdersIcon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Orders"
        {...props}
      >
        <rect x="5" y="4.5" width="14" height="17" rx="2.2"/><rect x="9" y="2.3" width="6" height="3.4" rx="1.2" /><circle cx="8" cy="11" r="0.75" fill="currentColor" stroke="none"/><line x1="10.3" y1="11" x2="16.5" y2="11"/><circle cx="8" cy="14.5" r="0.75" fill="currentColor" stroke="none"/><line x1="10.3" y1="14.5" x2="16.5" y2="14.5"/><circle cx="8" cy="18" r="0.75" fill="currentColor" stroke="none"/><line x1="10.3" y1="18" x2="14.5" y2="18"/>
      </svg>
    );
  }
  
  export function LogoutIcon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Log out"
        {...props}
      >
        <path d="M10 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H10"/><line x1="9.5" y1="12" x2="20" y2="12"/><path d="M16.5 8l4 4-4 4"/>
      </svg>
    );
  }
  
  export function EyeIcon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Show password"
        {...props}
      >
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    );
  }
  
  export function TrashIcon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Delete"
        {...props}
      >
        <line x1="4" y1="7" x2="20" y2="7"/><path d="M9.5 7V4.3a1.2 1.2 0 0 1 1.2-1.2h2.6a1.2 1.2 0 0 1 1.2 1.2V7"/><path d="M6.3 7l1 13.1A2 2 0 0 0 9.3 22h5.4a2 2 0 0 0 2-1.9l1-13.1"/><line x1="10.2" y1="11" x2="10.2" y2="17.5"/><line x1="13.8" y1="11" x2="13.8" y2="17.5"/>
      </svg>
    );
  }
  
  export function AssistantIcon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Assistant"
        {...props}
      >
        <circle cx="12" cy="12" r="7.5"/><path d="M6 9.5a6 6 0 0 1 12 0"/><rect x="3.2" y="9" width="2.6" height="4.4" rx="1.1"/><rect x="18.2" y="9" width="2.6" height="4.4" rx="1.1"/><circle cx="9.3" cy="12" r="1.05" fill="currentColor" stroke="none"/><circle cx="14.7" cy="12" r="1.05" fill="currentColor" stroke="none"/><path d="M9.3 15.3q2.7 2 5.4 0"/><path d="M9 19.5l-1.6 2.6 3.4-1.1"/>
      </svg>
    );
  }
  
  export function CloseIcon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Close"
        {...props}
      >
        <path d="M6 6l12 12"/><path d="M18 6L6 18"/>
      </svg>
    );
  }
  
  export function CheckIcon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Confirm"
        {...props}
      >
        <path d="M4.5 12.5l5 5 10-11"/>
      </svg>
    );
  }