declare module '*.css';

declare module '*.svg' {
  const svg: {
    src: any;
  };
  export default svg;
}
