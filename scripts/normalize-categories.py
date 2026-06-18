#!/usr/bin/env python3
import re, glob
MAP = {
    "ai":"AI","AI":"AI",
    "research":"Research","Research":"Research",
    "openclaw":"OpenClaw","OpenClaw":"OpenClaw",
    "engineering":"Engineering","Engineering":"Engineering",
    "development":"Development","Development":"Development",
    "cloud":"Cloud","Cloud":"Cloud",
    "news":"News","News":"News","新闻":"News",
    "周报":"周报","开源":"开源","工具":"工具","商业":"商业",
}
def norm(tok):
    t = tok.strip().strip('"').strip("'")
    return MAP.get(t, MAP.get(t.lower(), t))
changed = {}
for path in glob.glob("_posts/*.md"):
    f=open(path,encoding="utf-8"); lines=f.readlines(); f.close()
    out=[]; hit=False; c=0
    for ln in lines:
        if ln.startswith("---"):
            c+=1
        if c==1 and re.match(r'^categories:', ln):
            m=re.match(r'^categories:\s*(.*)$', ln.rstrip("\n"))
            val=m.group(1).strip()
            if val.startswith("[") and val.endswith("]"):
                toks=[norm(x) for x in val[1:-1].split(",") if x.strip()]
            elif val:
                toks=[norm(val)]
            else:
                out.append(ln); continue
            # 去重保序
            seen=[]; [seen.append(t) for t in toks if t not in seen]
            new="categories: [%s]\n" % ", ".join(seen)
            if new!=ln:
                hit=True
            out.append(new); continue
        out.append(ln)
    if hit:
        f=open(path,"w",encoding="utf-8"); f.writelines(out); f.close()
        changed[path]=1
print("归一化 %d 篇 categories" % len(changed))
for k in sorted(changed): print("  "+k.split("/")[-1])
