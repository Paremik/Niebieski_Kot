import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
await build({entryPoints:['tests/site.test.jsx'], bundle:true, platform:'node', format:'esm', packages:'external', jsx:'automatic', outfile:'.test-build/site.test.mjs'});
const result = spawnSync(process.execPath, ['--test','.test-build/site.test.mjs'],{stdio:'inherit'});
process.exitCode = result.status ?? 1;
