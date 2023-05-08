declare module '*.png' {
  const value: never;
  export = value;
}

declare module '*.jpg' {
  const value: never;
  export = value;
}

declare module '*.module.scss' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export = value;
}
