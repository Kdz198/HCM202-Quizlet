import re
import json
from pathlib import Path

lines = [l.strip() for l in Path(r"d:\CursorProejct\hcm_raw.txt").read_text(encoding="utf-8").splitlines() if l.strip()]

OPTION_RE = re.compile(r"^([A-Da-d])\.\s*(.*)$")
ANSWER_LETTER_RE = re.compile(r"^([A-Da-d])\.?$")


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


def parse_option_line(line: str):
    m = OPTION_RE.match(line)
    if m:
        return m.group(1).upper(), m.group(2).strip()
    return None


def is_option_line(line: str) -> bool:
    return bool(OPTION_RE.match(line))


def parse_questions(raw_lines: list) -> list:
    questions = []
    i = 0
    n = len(raw_lines)

    while i < n:
        # Skip stray option lines
        if is_option_line(raw_lines[i]):
            i += 1
            continue

        # Collect question text
        q_parts = []
        while i < n and not is_option_line(raw_lines[i]):
            q_parts.append(raw_lines[i])
            i += 1

        if not q_parts:
            i += 1
            continue

        # Collect option lines (A, B, C, D) — max 4 distinct letters
        options = {}
        while i < n and len(options) < 4:
            line = raw_lines[i]
            p = parse_option_line(line)
            if not p:
                break
            letter, text = p
            if letter in options:
                break
            options[letter] = text
            i += 1

        if len(options) < 2:
            continue

        # The next line should be the answer (repeated option)
        correct = None
        if i < n:
            line = raw_lines[i]
            p = parse_option_line(line)
            if p:
                letter, text = p
                if letter in options:
                    correct = letter
                    i += 1
            else:
                m = ANSWER_LETTER_RE.match(line)
                if m:
                    letter = m.group(1).upper()
                    if letter in options:
                        correct = letter
                        i += 1

        if not correct or len(options) < 2:
            continue

        q_text = re.sub(r"^\d+\s+", "", " ".join(q_parts))
        ordered = [{"id": L, "text": options[L]} for L in "ABCD" if L in options]
        questions.append({"q": q_text, "options": ordered, "correct": correct})

    return questions


questions = parse_questions(lines)
seen = set()
unique = []
for q in questions:
    key = norm(q["q"])
    if key not in seen:
        seen.add(key)
        unique.append(q)

Path(r"d:\CursorProejct\hcm_questions.json").write_text(
    json.dumps(unique, ensure_ascii=False), encoding="utf-8"
)
Path(r"d:\CursorProejct\hcm_data.js").write_text(
    "const HCM_QUESTIONS = " + json.dumps(unique, ensure_ascii=False) + ";",
    encoding="utf-8"
)
print("parsed", len(questions), "deduped", len(unique))