const { execSync } = require('child_process');

function run(cmd) {
  try {
    console.log(`\n\n--- Running: ${cmd} ---`);
    const out = execSync(cmd, { stdio: 'pipe' }).toString();
    console.log(out || "(No output)");
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    console.error(e.stderr?.toString() || "(No stderr)");
  }
}

run('git --version');
run('git init');
run('git remote -v');
run('git status');
run('whoami');
run('dir /a');
