const { execSync } = require('child_process');

const path = 'public/locales';

const command = `locize save-missing --project-id ${process.env.REACT_APP_LOCIZE_PROJECT_ID} --api-key ${process.env.REACT_APP_LOCIZE_API_KEY} --path ${path}`;

const runCommand = (command) => {
  execSync(command, { stdio: [0, 1, 2] });
};

runCommand(command);
