#!/usr/bin/env python3
import re, glob
POSTS = glob.glob("_posts/*.md")
changed = {}
LINE_KILL = [
    re.compile(r'^>?\s*\*{0,2}(研究员|作者)\*{0,2}\s*[:：].*?(wairesearch|黄山).*$'),
    re.compile(r'^\*报告由.*?(wairesearch|黄山).*\*\s*$'),
    re.compile(r'^\*文档由\s*wairesearch.*\*\s*$'),
    re.compile(r'^\*研究来源[:：]\s*wairesearch.*\*\s*$'),
    re.compile(r'^\*研究时间[:：].*?研究员[:：]\s*黄山.*\*\s*$'),
    re.compile(r'^>\s*📝\s*研究完成于.*黄山.*$'),
    re.compile(r'^>\s*📝\s*本文由五岳团队研究员黄山.*$'),
    re.compile(r'^>\s*\*{0,2}文档结束\*{0,2}.*卷王小组.*wairesearch.*$'),
    re.compile(r'^>\s*卷王小组\s*·\s*wairesearch.*$'),
    re.compile(r'^\*文档结束。如有疑问请联系\s*wairesearch。\*\s*$'),
    re.compile(r'^>\s*\*{0,2}作者\*{0,2}\s*[:：]\s*黄山\s*$'),
    re.compile(r'^>\s*\*{0,2}下一步建议\*{0,2}\s*[:：].*waicode.*$'),
]
for path in POSTS:
    f = open(path, encoding="utf-8")
    lines = f.readlines()
    f.close()
    out = []
    hit = 0
    for ln in lines:
        s = ln.rstrip("\n")
        if re.match(r'^author:\s*五岳团队\s*$', s):
            out.append("author: W.ai\n")
            hit += 1
            continue
        if any(p.match(s) for p in LINE_KILL):
            hit += 1
            continue
        out.append(ln)
    if hit:
        f = open(path, "w", encoding="utf-8")
        f.writelines(out)
        f.close()
        changed[path] = hit
for k, v in sorted(changed.items()):
    print("  %d处  %s" % (v, k.split('/')[-1]))
print("共处理 %d 篇，%d 处署名" % (len(changed), sum(changed.values())))
