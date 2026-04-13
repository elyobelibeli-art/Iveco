import { existsSync } from 'node:fs';

const required = [
  'index.html',
  'package.json',
  'src/main.jsx',
  'src/pages/Home.jsx',
  'src/components/ReFrameModel.jsx',
  'src/components/ControlsPanel.jsx',
  'src/utils/animation.js',
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.error('Missing required files:\n' + missing.map((m) => ` - ${m}`).join('\n'));
  process.exit(1);
}

console.log('Smoke test passed: all required MVP files exist.');
