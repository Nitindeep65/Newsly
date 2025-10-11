// Central app config. Read from env for runtime toggles used in components.
export const SHOW_IMAGES = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SHOW_IMAGES === 'false') ? false : true;
