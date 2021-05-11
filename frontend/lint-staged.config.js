// eslint-disable-next-line no-undef
module.exports = {
  '*.{js,jsx,ts,tsx,json,gql,graphql}': [
    (jsFiles) => jsFiles.map((jsFile) => `eslint --color --fix ${jsFile}`), // check and fix files
  ],
  '*.{scss,css}': [
    (cssFiles) => cssFiles.map((cssFile) => `yarn run lint:css ${cssFile}`), // check files
  ],
  //'*.{html,json,md}': [
  //  (htmlFiles) => htmlFiles.map((htmlFile) => `yarn run prettier ${htmlFile}`), // check files
  //],
};
