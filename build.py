#!/usr/bin/env python3
"""Assemble the static pages from the _*.html partials.

Run `python3 build.py` after editing a partial or a locale file. Each page is
written twice: in English at its path and in French at its `fr_path`, with the
text of locales/<lang>.json baked into the HTML so search engines index both
languages. The generated files are committed, GitHub Pages serves them as-is.
"""
import hashlib
import json
import os
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
SITE = "https://linto.ai"
LANGS = ("en", "fr")
# Google Search Console ownership of the https://linto.ai/ property.
GOOGLE_SITE_VERIFICATION = "8R9vu3x3UKvUEPlFYFi_WhY9CJ4Oi028k6oGNhqNxsE"


def asset_version():
    """Short hash of style.css and js/, appended to their URLs so browsers fetch new copies after a change."""
    digest = hashlib.sha1()
    for path in [ROOT / "style.css", *sorted((ROOT / "js").glob("*.js"))]:
        digest.update(path.read_bytes())
    return digest.hexdigest()[:8]


ASSET_VERSION = asset_version()

PAGES = {
    "index.html": {
        "page": "",
        "path": "/",
        "fr_path": "/fr/",
        "body": "_index_body.html",
        "title": "LinTO Studio - Open Source AI for Transcription, Live Subtitling, and Summarization",
        "description": "LinTO Studio is an open-source AI platform for transcription, live subtitling, and summarization. Built for privacy, ready for production, and self-hostable.",
        "keywords": "LinTO Studio, transcription, subtitles, captions, summarization, media management, speaker diarization, timestamp alignment, collaborative editing, AI agent for calls, multilingual, live translation, live subtitling events, open source transcription",
        "nav": "",
        "scripts": ["/js/site.js", "/js/explorer.js", "/js/cases.js"],
        "jsonld": "index",
    },
    "pricing/index.html": {
        "page": "pricing",
        "path": "/pricing/",
        "fr_path": "/fr/tarifs/",
        "body": "_pricing_body.html",
        "title": "Pricing - LinTO Studio: Free, Premium €19/month, Business €29.99/seat",
        "description": "LinTO Studio pricing: a free plan, Premium at €19 per month for individuals, Business at €29.99 per seat per month for teams. Live transcription with prepaid packs from €45. Open-source, hosted in France.",
        "keywords": "LinTO Studio pricing, transcription pricing, AI meeting notes price, live transcription packs, open source transcription SaaS",
        "nav": "pricing",
        "scripts": ["/js/site.js"],
        "jsonld": "pricing",
    },
    "live/index.html": {
        "page": "live",
        "path": "/live/",
        "fr_path": "/fr/evenementiel/",
        "body": "_live_body.html",
        "title": "Live subtitles and translation for events - LinTO Live",
        "description": "Real-time transcription and translation for conferences, assemblies and plenary sessions. SRT/RTMP feeds, QR code page for attendees, subtitle banner for screens, Teams bots. Managed per event or run by your team. Used at Wikimania 2026 and the European Commission.",
        "keywords": "live subtitles events, live captioning conference, real-time translation event, sous-titrage en direct événement, transcription temps réel, QR code subtitles, SRT RTMP captioning, Teams transcription bot",
        "nav": "live",
        "scripts": ["/js/site.js", "/js/quote.js", "/js/cases.js"],
        "jsonld": "live",
    },
    "compare/index.html": {
        "page": "compare",
        "path": "/compare/",
        "fr_path": "/fr/comparatif/",
        "body": "_compare_body.html",
        "title": "LinTO Studio vs Copilot, Gemini, Otter, Plaud, Noota and Leexi - comparison",
        "description": "LinTO Studio compared with Microsoft Copilot, Google Gemini, Otter, Plaud, Noota and Leexi: live transcription and translation, AV feeds, open source, self-hosting, hosting and price.",
        "keywords": "",
        "nav": "compare",
        "scripts": ["/js/site.js"],
        "jsonld": None,
    },
    "docs/templates/index.html": {
        "page": "templates",
        "path": "/docs/templates/",
        "fr_path": "/fr/docs/modeles/",
        "body": "_docs_templates_body.html",
        "title": "Document templates for minutes and summaries - LinTO Studio guide",
        "description": "How to export LinTO Studio minutes and summaries in your own Word template: placeholders, upload, preview, DOCX and PDF export, API.",
        "keywords": "LinTO Studio template, DOCX template meeting minutes, export summary Word template, document template AI minutes",
        "nav": "",
        "scripts": ["/js/site.js"],
        "jsonld": None,
    },
    "cgv/index.html": {
        "page": "cgv",
        "path": "/cgv/",
        "fr_path": "/fr/cgv/",
        "body": "_cgv_body.html",
        "title": "Conditions générales de vente - LinTO Studio",
        "description": "Conditions générales de vente et d'utilisation du service LinTO Studio (SaaS) édité par LINAGORA : plans, quotas, crédits live, facturation, résiliation, données.",
        "keywords": "",
        "nav": "",
        "scripts": ["/js/site.js"],
        "jsonld": None,
    },
    "privacy/index.html": {
        "page": "privacy",
        "path": "/privacy/",
        "fr_path": "/fr/confidentialite/",
        "body": "_privacy_body.html",
        "title": "Politique de confidentialité - LinTO Studio",
        "description": "Politique de confidentialité du service LinTO Studio (SaaS) édité par LINAGORA : données traitées, finalités, sous-traitants, durées de conservation, droits.",
        "keywords": "",
        "nav": "",
        "scripts": ["/js/site.js"],
        "jsonld": None,
    },
    "dpa/index.html": {
        "page": "dpa",
        "path": "/dpa/",
        "fr_path": "/fr/dpa/",
        "body": "_dpa_body.html",
        "title": "Accord de sous-traitance de données (DPA) - LinTO Studio",
        "description": "Accord de sous-traitance de données (DPA, article 28 du RGPD) du service LinTO Studio (SaaS) édité par LINAGORA : obligations, mesures de sécurité, sous-traitants ultérieurs.",
        "keywords": "",
        "nav": "",
        "scripts": ["/js/site.js"],
        "jsonld": None,
    },
    "legal/index.html": {
        "page": "legal",
        "path": "/legal/",
        "fr_path": "/fr/mentions-legales/",
        "body": "_legal_body.html",
        "title": "Legal notice - LinTO",
        "description": "Legal notice of linto.ai and LinTO Studio Cloud, published by LINAGORA.",
        "keywords": "",
        "nav": "",
        "scripts": ["/js/site.js"],
        "jsonld": None,
        "noindex": False,
    },
}

ORG = {
    "@type": "Organization",
    "@id": SITE + "/#organization",
    "name": "LINAGORA",
    "url": SITE + "/",
    "logo": SITE + "/images/linto.svg",
    "sameAs": [
        "https://github.com/linto-ai",
        "https://linagora.com",
        "https://discord.com/invite/jvNK3FXv3d",
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "contact@linto.ai",
        "availableLanguage": ["fr", "en"],
    },
}

def jsonld(kind, ctx):
    """Structured data for the page; `ctx` carries the localized URLs and description."""
    url, pricing_url, desc = ctx["url"], ctx["pricing_url"], ctx["description"]
    if kind == "index":
        data = {
            "@context": "https://schema.org",
            "@graph": [
                ORG,
                {
                    "@type": "SoftwareApplication",
                    "name": "LinTO Studio",
                    "url": url,
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "Web",
                    "description": desc,
                    "inLanguage": ctx["lang"],
                    "publisher": {"@id": SITE + "/#organization"},
                    "license": "https://www.gnu.org/licenses/agpl-3.0.html",
                    "offers": [
                        {"@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "EUR", "url": pricing_url},
                        {"@type": "Offer", "name": "Premium", "price": "19", "priceCurrency": "EUR", "url": pricing_url},
                        {"@type": "Offer", "name": "Business", "price": "29.99", "priceCurrency": "EUR", "url": pricing_url},
                    ],
                },
            ],
        }
    elif kind == "pricing":
        data = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "LinTO Studio Cloud",
            "url": url,
            "brand": {"@id": SITE + "/#organization"},
            "description": desc,
            "offers": [
                {"@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Premium monthly", "price": "19", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Premium yearly", "price": "192", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Business monthly, per seat", "price": "29.99", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Business yearly, per seat", "price": "288", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
            ],
        }
    elif kind == "live":
        data = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "LinTO Live for events",
            "serviceType": "Live subtitling and translation for events",
            "url": url,
            "provider": {"@id": SITE + "/#organization"},
            "areaServed": "Europe",
            "description": desc,
        }
    else:
        return ""
    return '  <script type="application/ld+json">\n' + json.dumps(data, ensure_ascii=False, indent=2) + "\n  </script>\n"


VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
KEY_RE = re.compile(r'<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?\sdata-i18n-key="([^"]+)"[^>]*>')
ATTR_RE = re.compile(r'<[a-zA-Z][^>]*?\sdata-i18n-attr="([^"]+)"[^>]*>')


def closing_tag(html, tag, pos):
    """Position of the tag closing the element whose content starts at `pos`."""
    open_re = re.compile(rf"<{tag}\b", re.I)
    close_re = re.compile(rf"</{tag}\s*>", re.I)
    depth = 1
    while True:
        close = close_re.search(html, pos)
        if close is None:
            raise ValueError(f"unclosed <{tag}> at {pos}")
        nested = open_re.search(html, pos, close.start())
        if nested:
            depth += 1
            pos = nested.end()
            continue
        depth -= 1
        if depth == 0:
            return close.start()
        pos = close.end()


def localize(html, dict_):
    """Same job as translatePage() in js/i18n.js, done at build time."""
    out, pos = [], 0
    while True:
        m = KEY_RE.search(html, pos)
        if m is None:
            break
        tag, key = m.group(1).lower(), m.group(2)
        out.append(html[pos:m.end()])
        pos = m.end()
        if tag in VOID_TAGS or m.group(0).endswith("/>") or key not in dict_:
            continue
        end = closing_tag(html, tag, pos)
        out.append(dict_[key])
        pos = end
    out.append(html[pos:])
    html = "".join(out)

    def set_attrs(m):
        tag_text = m.group(0)
        for pair in m.group(1).split(";"):
            attr, _, key = pair.partition(":")
            if not attr or key not in dict_:
                continue
            value = dict_[key].replace('"', "&quot;")
            attr_re = re.compile(rf'(\s{re.escape(attr)}=")[^"]*(")')
            if attr_re.search(tag_text):
                tag_text = attr_re.sub(lambda a: a.group(1) + value + a.group(2), tag_text, count=1)
            else:
                tag_text = re.sub(r"\s*/?>$", f' {attr}="{value}">', tag_text)
        return tag_text

    return ATTR_RE.sub(set_attrs, html)


def page_path(cfg, lang):
    return cfg["fr_path"] if lang == "fr" else cfg["path"]


def out_file(path):
    return path.strip("/") + "/index.html" if path != "/" else "index.html"


# English path prefix -> French path prefix, longest first so /docs/templates/ wins over /.
FR_PREFIXES = sorted(((c["path"], c["fr_path"]) for c in PAGES.values() if c["path"] != "/"), key=lambda p: -len(p[0]))


def fr_href(url):
    path, sep, frag = url.partition("#")
    if path == "/":
        return "/fr/" + sep + frag
    for en, fr in FR_PREFIXES:
        if path.startswith(en):
            return fr + path[len(en):] + sep + frag
    return url


def french_links(html):
    return re.sub(r'href="(/[^"]*)"', lambda m: f'href="{fr_href(m.group(1))}"', html)


# English pages send French-speaking visitors to the French page, before anything renders.
# The choice made with the EN | FR switcher wins over the browser language.
REDIRECT = """  <script>try{{var l=localStorage.getItem('linto-lang')||(navigator.language||'').slice(0,2);if(l==='fr')location.replace('{fr}'+location.hash)}}catch(e){{}}</script>
"""


def head(cfg, lang, dict_):
    page = cfg["page"]
    title = dict_.get(f"title_{page}" if page else "title", cfg["title"])
    desc = dict_.get(f"meta_description_{page}" if page else "meta_description", cfg["description"])
    url = SITE + page_path(cfg, lang)
    en_url, fr_url = SITE + cfg["path"], SITE + cfg["fr_path"]
    pricing_url = SITE + page_path(PAGES["pricing/index.html"], lang)
    body_attr = f' data-page="{page}"' if page else ""
    keywords = f'  <meta name="keywords" content="{cfg["keywords"]}" />\n' if cfg["keywords"] and lang == "en" else ""
    redirect = REDIRECT.format(fr=cfg["fr_path"]) if lang == "en" else ""
    ctx = {"url": url, "pricing_url": pricing_url, "description": desc, "lang": lang}
    return f"""<!DOCTYPE html>
<html lang="{lang}" data-i18n="static">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-site-verification" content="{GOOGLE_SITE_VERIFICATION}" />
{redirect}  <title>{title}</title>
  <meta name="description" content="{desc}" />
{keywords}  <link rel="canonical" href="{url}" />
  <link rel="alternate" hreflang="en" href="{en_url}" />
  <link rel="alternate" hreflang="fr" href="{fr_url}" />
  <link rel="alternate" hreflang="x-default" href="{en_url}" />
  <link rel="icon" href="/images/linto.svg" />
  <link rel="stylesheet" href="/style.css?v={ASSET_VERSION}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="LinTO Studio" />
  <meta property="og:locale" content="{"fr_FR" if lang == "fr" else "en_US"}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:image" content="{SITE}/screenshot.png" />
  <meta name="twitter:card" content="summary_large_image" />
{jsonld(cfg["jsonld"], ctx)}</head>

<body{body_attr}>
"""


def tail(cfg):
    local = ["/js/i18n.js", "/js/contact.js", "/js/cookies.js"] + cfg["scripts"]
    scripts = "".join(f'  <script src="{s}?v={ASSET_VERSION}"></script>\n' for s in local)
    return (
        '  <script src="https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js"></script>\n'
        + scripts
        + (ROOT / "_matomo.html").read_text()
        + "</body>\n</html>\n"
    )


def mark_nav(header, nav):
    if not nav:
        return header
    return header.replace(f'data-nav="{nav}"', f'data-nav="{nav}" class="active"')


def lang_switcher(header, cfg, lang):
    """Point EN | FR at the same page in the other language."""
    for code in LANGS:
        active = ' class="active"' if code == lang else ""
        header = header.replace(
            f'<a href="#" id="lang-{code}">',
            f'<a href="{page_path(cfg, code)}" id="lang-{code}" hreflang="{code}"{active}>',
        )
    return header


def main():
    header = (ROOT / "_header.html").read_text()
    footer = (ROOT / "_footer.html").read_text()
    dicts = {lang: json.loads((ROOT / "locales" / f"{lang}.json").read_text()) for lang in LANGS}
    for cfg in PAGES.values():
        body = (ROOT / cfg["body"]).read_text()
        for lang in LANGS:
            html = localize(head(cfg, lang, dicts[lang]) + mark_nav(header, cfg["nav"]) + body + footer, dicts[lang]) + tail(cfg)
            if lang == "fr":
                html = french_links(html)
            html = lang_switcher(html, cfg, lang)
            out = out_file(page_path(cfg, lang))
            path = ROOT / out
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(html)
            print("wrote", out, len(html))

    urls = ""
    for cfg in PAGES.values():
        alternates = "".join(
            f'    <xhtml:link rel="alternate" hreflang="{code}" href="{SITE}{page_path(cfg, code)}"/>\n' for code in LANGS
        )
        for lang in LANGS:
            urls += f"  <url>\n    <loc>{SITE}{page_path(cfg, lang)}</loc>\n{alternates}  </url>\n"
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + urls + "</urlset>\n"
    )
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /runtime/\nDisallow: /save/\n\nSitemap: {SITE}/sitemap.xml\n")
    print("wrote sitemap.xml robots.txt")


if __name__ == "__main__":
    os.chdir(ROOT)
    main()
