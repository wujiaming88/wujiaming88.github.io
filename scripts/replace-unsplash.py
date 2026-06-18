#!/usr/bin/env python3
import re, glob, os
imgs = sorted([f for f in os.listdir("assets/images/posts")
               if f.lower().endswith((".png",".jpg",".jpeg"))])
posts = sorted([p for p in glob.glob("_posts/*.md")
                if "images.unsplash.com" in open(p,encoding="utf-8").read()])
changed = []
i = 0
for path in posts:
    f=open(path,encoding="utf-8"); lines=f.readlines(); f.close()
    out=[]; hit=False
    for ln in lines:
        if "images.unsplash.com" in ln:
            local = "/assets/images/posts/" + imgs[i % len(imgs)]
            i += 1
            # 替换 url 部分，保留 key（overlay_image: 等）和引号风格
            new = re.sub(r'https?://images\.unsplash\.com[^\s"\')]*', local, ln)
            out.append(new); hit=True
        else:
            out.append(ln)
    if hit:
        f=open(path,"w",encoding="utf-8"); f.writelines(out); f.close()
        changed.append((os.path.basename(path), local))
for name,img in changed:
    print("  %-55s -> %s" % (name, img.split('/')[-1]))
print("共替换 %d 篇 Unsplash 配图" % len(changed))
