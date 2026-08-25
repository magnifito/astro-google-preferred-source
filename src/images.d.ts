declare module '*.png' {
  interface ImageMetadata {
    src: string;
    width: number;
    height: number;
    format: string;
  }
  const content: ImageMetadata;
  export default content;
}
