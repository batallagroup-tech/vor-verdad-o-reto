/// <reference types="vite/client" />

// Allow JSON module imports
declare module "*.json" {
  const value: any;
  export default value;
}
