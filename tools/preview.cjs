// Keep Wrangler's changing cache outside the directory of watched static files.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
config.assets.directory=root;
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'zraid-preview-'));
const configPath=path.join(temporary,'wrangler.json');
fs.writeFileSync(configPath,JSON.stringify(config));
const child=spawn(process.execPath,[path.join(root,'node_modules/wrangler/bin/wrangler.js'),'dev','--config',configPath,'--local',...process.argv.slice(2)],{cwd:root,stdio:'inherit'});
child.on('exit',code=>{fs.rmSync(temporary,{recursive:true,force:true});process.exitCode=code||0;});
process.on('SIGINT',()=>child.kill('SIGINT'));
