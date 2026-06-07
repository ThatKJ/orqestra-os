interface PlausibleWindow {
  plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
}

export function trackEvent(name: string, props?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;

  const win = window as unknown as PlausibleWindow;
  if (win.plausible) {
    win.plausible(name, props ? { props } : undefined);
  }
}

export const Events = {
  PAGE_VIEW: 'pageview',
  FORM_VIEWED: 'Waitlist Form Viewed',
  FORM_SUBMITTED: 'Waitlist Form Submitted',
  FORM_ERROR: 'Waitlist Form Error',
  FORM_SUCCESS: 'Waitlist Form Success',
} as const;
