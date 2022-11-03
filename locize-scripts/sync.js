const readline = require('readline');
const { execSync } = require('child_process');

const version = process.env.REACT_APP_LOCIZE_SYNC_VERSION;

const command = `locize sync --project-id ${process.env.REACT_APP_LOCIZE_PROJECT_ID} --api-key ${process.env.REACT_APP_LOCIZE_API_KEY} --ver ${version} --path src/locales`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('close', function () {
  process.exit(0);
});

rl.question(
  'WARNING: Before synchronization download latest translations, otherwise you can delete other people work. Are you sure you want to proceed? y/n ',
  function (answer) {
    if (answer.match(/^y(es)?$/i)) {
      runCommand(command);
      rl.close();
    } else {
      rl.close();
    }
  }
);

const runCommand = (command) => {
  execSync(command, { stdio: [0, 1, 2] });
};
