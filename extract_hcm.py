import zipfile
import re
import json
from pathlib import Path

p = Path(r"d:\FPTU\hcm.docx")
with zipfile.ZipFile(p) as z:
    xml = z.read("word/document.xml").decode("utf-8")

text = re.sub(r"</w:p>", "\n", xml)
text = re.sub(r"<[^>]+>", "", text)
for a, b in [("&lt;", "<"), ("&gt;", ">"), ("&amp;", "&"), ("&quot;", '"')]:
    text = text.replace(a, b)

lines = [l.strip() for l in text.split("\n") if l.strip()]
Path(r"d:\CursorProejct\hcm_raw.txt").write_text("\n".join(lines), encoding="utf-8")
print("saved", len(lines), "lines")
