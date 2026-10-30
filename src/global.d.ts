declare module '*.css';

declare module '*.svg' {
  const svg: {
    src: any;
  };
  export default svg;
}

declare module '*.png' {
  const png: {
    src: any;
  };
  export default png;
}
