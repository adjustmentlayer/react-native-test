const { execSync } = require('child_process');
const version = process.env.REACT_APP_LOCIZE_DOWNLOAD_VERSION;

const path = 'src/locales';

const command = `locize download --project-id ${process.env.REACT_APP_LOCIZE_PROJECT_ID} --api-key ${process.env.REACT_APP_LOCIZE_API_KEY} --ver ${version} --path ${path} --format flat`;

const runCommand = (command) => {
  execSync(command, { stdio: [0, 1, 2] });
};

runCommand(command);
