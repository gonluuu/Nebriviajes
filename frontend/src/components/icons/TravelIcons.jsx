import React from "react";

export function IconPlane({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9L2 14v2l8-2.5V19l-2 1.5V22l3-1 3 1v-1.5L13 19v-5.5L21 16Z" />
    </svg>
  );
}

export function IconBed({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 13h10a3 3 0 0 0 3-3V8a2 2 0 0 0-2-2H7A3 3 0 0 0 4 9v9h2v-2h16v2h2v-5a3 3 0 0 0-3-3H7Zm0-5h11v2a1 1 0 0 1-1 1H7a1 1 0 0 1 0-2Z" />
    </svg>
  );
}

export function IconTrain({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2c-4 0-8 .5-8 4v9c0 2.2 1.8 4 4 4l-2 2v1h2.5l2.2-2h2.6l2.2 2H18v-1l-2-2c2.2 0 4-1.8 4-4V6c0-3.5-4-4-8-4Zm-6 6h12v5H6V8Zm2 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
    </svg>
  );
}

export function IconCar({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11v7h-2v-2H7v2H5v-7Zm3.2-4  -.6 2h8.8l-.6-2H8.2ZM7.5 14.5A1.5 1.5 0 1 0 7.5 17a1.5 1.5 0 0 0 0-2.5Zm9 0A1.5 1.5 0 1 0 16.5 17a1.5 1.5 0 0 0 0-2.5Z" />
    </svg>
  );
}

export function IconCalendar({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm14 8H3v10h18V10ZM3 8h18V6H3v2Z" />
    </svg>
  );
}

export function IconCalendarCheck({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v6h-2V10H3v10h8v2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm14 6V6H3v2h18Z" />
      <path d="M16.2 22.2 13 19l1.4-1.4 1.8 1.8 4-4L21.6 16l-5.4 6.2Z" />
    </svg>
  );
}

export function IconSearch({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 2a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
    </svg>
  );
}

export function IconUser({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0-8a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z" />
      <path d="M4 20a8 8 0 0 1 16 0h-2a6 6 0 0 0-12 0H4Z" />
    </svg>
  );
}
