// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiServer: 'http://localhost:8080/api',
  server: 'http://localhost:8080/',
  msczEndpoint: '/mscz',
  pdfEndpoint: '/pdf',
  imageEndpoint: '/image',
  otherEndpoint: '/other',
  filesEndpoint: '/files',
  instrument_endpoint: '/instrument',
  scoreBook_endpoint: '/scoreBook',
  scoreBookTitle_endpoint: '/scoreBookTitle',
  score: '/score',
  scoreTitle: '/scoreTitle',
  storage: '/storage',
  fileMetadata: '/fileMetadata',
  userEndpoint: '/user',
  jobEndpoint: '/jobs'
};
