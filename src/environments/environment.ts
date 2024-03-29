// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/',
  photoUrl: 'http://localhost:5000/applicant/',
  attachmentUrl: 'http://localhost:5000/applicant/attachment/',
  sampleFileUrl: 'http://localhost:5000/sampleFile/',
  oldCVurl: 'http://localhost:51000/',
};
