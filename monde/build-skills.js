const fs=require('fs'),path=require('path');const root=process.argv[2],out=process.argv[3];const res={};
for(const d of fs.readdirSync(root)){const p=path.join(root,d);if(!fs.statSync(p).isDirectory())continue;
 const skill=fs.readFileSync(path.join(p,'SKILL.md'),'utf8').replace(/^---[\s\S]*?---\s*/,'');const refs={};
 const rd=path.join(p,'references');if(fs.existsSync(rd))for(const f of fs.readdirSync(rd))if(f.endsWith('.md'))refs[f.replace(/\.md$/,'')]=fs.readFileSync(path.join(rd,f),'utf8');
 res[d]={skill,refs};}
fs.writeFileSync(out,JSON.stringify(res));console.log(Object.keys(res).length,fs.statSync(out).size);
