/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "src": { url: "/_dist_" },
    "public": { url: "/" },
    "libs": { url: "/_libs_", static: true, resolve: false }
  },
  plugins: [
    ['@snowpack/plugin-run-script',
    {
      cmd: 'copyfiles -f ./node_modules/aframe/dist/aframe-v1.1.0.min.js libs',
      watch: 'copyfiles -f ./node_modules/aframe/dist/aframe-v1.1.0.min.js libs',
    }],
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-optimize',
    'snowpack-plugin-sass',
    '@prefresh/snowpack',
    'snowpack-plugin-terser'
  ],
  install: [
  ],
  installOptions: {
    installTypes: true,
    treeshake: true,
  },
  devOptions: {
    secure: true
  },
  buildOptions: {

  },
  proxy: {
  },
  alias: {
  },
};
