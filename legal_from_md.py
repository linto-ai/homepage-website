#!/usr/bin/env python3
"""Regenerate a legal page body from its Markdown source in the private SaaS plugin (docs/legal/).

Usage: python3 legal_from_md.py cgv path/to/CGV.md > _cgv_body.html
       python3 legal_from_md.py privacy path/to/POLITIQUE-CONFIDENTIALITE.md > _privacy_body.html
then python3 build.py. A URL followed by punctuation keeps the punctuation out of the link.
"""
import html
import re
import sys

IND = " " * 8
URL = re.compile(r"https?://[^\s<]+")
MAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")


def link_url(m):
    url = m.group(0)
    tail = ""
    while url and url[-1] in ".,;:)":
        tail = url[-1] + tail
        url = url[:-1]
    return f'<a href="{url}">{url}</a>{tail}'


def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    # links first, then e-mails outside of them
    parts = re.split(r"(<a [^>]*>.*?</a>)", URL.sub(link_url, text))
    out = []
    for p in parts:
        if p.startswith("<a "):
            out.append(p)
            continue
        out.append(MAIL.sub(lambda m: f'<a href="mailto:{m.group(0).rstrip(".")}">{m.group(0).rstrip(".")}</a>' + ("." if m.group(0).endswith(".") else ""), p))
    return "".join(out)


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


# English note shown above the French text (the French locale leaves it empty)
LANG_NOTES = {
    "cgv": "These terms are published in French, which is the binding version.",
    "privacy": "This privacy policy is published in French.",
    "dpa": "This data processing agreement is published in French, which is the binding version.",
}


def convert(md, page="cgv"):
    out = [
        "  <main>",
        '    <section class="container">',
        '      <div class="prose cgv">',
        f'{IND}<p class="cgv-lang-note" data-i18n-key="{page}_lang_note">{LANG_NOTES[page]}</p>',
    ]
    lines = md.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line or line.startswith(">") or line == "---":
            i += 1
            continue
        if line.startswith("### "):
            out.append(f"{IND}<h3>{inline(line[4:])}</h3>")
        elif line.startswith("## "):
            out.append(f"{IND}<h2>{inline(line[3:])}</h2>")
        elif line.startswith("# "):
            out.append(f"{IND}<h1>{inline(line[2:])}</h1>")
        elif line.startswith("- "):
            out.append(f"{IND}<ul>")
            while i < len(lines) and lines[i].startswith("- "):
                out.append(f"{IND}<li>{inline(lines[i][2:].rstrip())}</li>")
                i += 1
            out.append(f"{IND}</ul>")
            continue
        elif line.startswith("|"):
            head = cells(line)
            i += 2  # skip the |---| separator
            out.append(f'{IND}<div class="table-wrap"><table class="cgv-table">')
            out.append(f"{IND}<thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr></thead><tbody>")
            while i < len(lines) and lines[i].startswith("|"):
                out.append(f"{IND}<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells(lines[i])) + "</tr>")
                i += 1
            out.append(f"{IND}</tbody></table></div>")
            continue
        else:
            out.append(f"{IND}<p>{inline(line)}</p>")
        i += 1
    out += ["      </div>", "    </section>", "  </main>"]
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    sys.stdout.write(convert(open(sys.argv[2], encoding="utf-8").read(), sys.argv[1]))
