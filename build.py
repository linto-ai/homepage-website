#!/usr/bin/env python3
"""Assemble the static pages from the _*.html partials.

Run `python3 build.py` after editing a partial. The generated files
(index.html, pricing/index.html, live/index.html, legal/index.html) are
committed, GitHub Pages serves them as-is.
"""
import json
import os
import pathlib

ROOT = pathlib.Path(__file__).parent
SITE = "https://linto.ai"

PAGES = {
    "index.html": {
        "page": "",
        "path": "/",
        "body": "_index_body.html",
        "title": "LinTO Studio - Open Source AI for Transcription, Live Subtitling, and Summarization",
        "description": "LinTO Studio is an open-source AI platform for transcription, live subtitling, and summarization. Built for privacy, ready for production, and self-hostable.",
        "keywords": "LinTO Studio, transcription, subtitles, captions, summarization, media management, speaker diarization, timestamp alignment, collaborative editing, AI agent for calls, multilingual, live translation, live subtitling events, open source transcription",
        "nav": "",
        "scripts": ["/js/site.js"],
        "jsonld": "index",
    },
    "pricing/index.html": {
        "page": "pricing",
        "path": "/pricing/",
        "body": "_pricing_body.html",
        "title": "Pricing - LinTO Studio: Free, Premium €19/month, Business €15/seat",
        "description": "LinTO Studio pricing: a free plan, Premium at €19 per month for individuals, Business at €15 per seat per month for teams. Live transcription with prepaid packs from €25. Open-source, hosted in France.",
        "keywords": "LinTO Studio pricing, transcription pricing, AI meeting notes price, live transcription packs, open source transcription SaaS",
        "nav": "pricing",
        "scripts": ["/js/site.js"],
        "jsonld": "pricing",
    },
    "live/index.html": {
        "page": "live",
        "path": "/live/",
        "body": "_live_body.html",
        "title": "Live subtitles and translation for events - LinTO Live",
        "description": "Real-time transcription and translation for conferences, assemblies and plenary sessions. SRT/RTMP feeds, QR code page for attendees, subtitle banner for screens, Teams bots. Managed per event or run by your team. Used at Wikimania 2026 and the European Commission.",
        "keywords": "live subtitles events, live captioning conference, real-time translation event, sous-titrage en direct événement, transcription temps réel, QR code subtitles, SRT RTMP captioning, Teams transcription bot",
        "nav": "live",
        "scripts": ["/js/site.js", "/js/quote.js"],
        "jsonld": "live",
    },
    "docs/templates/index.html": {
        "page": "templates",
        "path": "/docs/templates/",
        "body": "_docs_templates_body.html",
        "title": "Document templates for minutes and summaries - LinTO Studio guide",
        "description": "How to export LinTO Studio minutes and summaries in your own Word template: placeholders, upload, preview, DOCX and PDF export, API.",
        "keywords": "LinTO Studio template, DOCX template meeting minutes, export summary Word template, document template AI minutes",
        "nav": "",
        "scripts": ["/js/site.js"],
        "jsonld": None,
    },
    "legal/index.html": {
        "page": "legal",
        "path": "/legal/",
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

def jsonld(kind):
    if kind == "index":
        data = {
            "@context": "https://schema.org",
            "@graph": [
                ORG,
                {
                    "@type": "SoftwareApplication",
                    "name": "LinTO Studio",
                    "url": SITE + "/",
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "Web",
                    "description": PAGES["index.html"]["description"],
                    "publisher": {"@id": SITE + "/#organization"},
                    "license": "https://www.gnu.org/licenses/agpl-3.0.html",
                    "offers": [
                        {"@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "EUR", "url": SITE + "/pricing/"},
                        {"@type": "Offer", "name": "Premium", "price": "19", "priceCurrency": "EUR", "url": SITE + "/pricing/"},
                        {"@type": "Offer", "name": "Business", "price": "15", "priceCurrency": "EUR", "url": SITE + "/pricing/"},
                    ],
                },
            ],
        }
    elif kind == "pricing":
        data = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "LinTO Studio Cloud",
            "url": SITE + "/pricing/",
            "brand": {"@id": SITE + "/#organization"},
            "description": PAGES["pricing/index.html"]["description"],
            "offers": [
                {"@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Premium monthly", "price": "19", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Premium yearly", "price": "192", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Business monthly, per seat", "price": "15", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Business yearly, per seat", "price": "144", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
            ],
        }
    elif kind == "live":
        data = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "LinTO Live for events",
            "serviceType": "Live subtitling and translation for events",
            "url": SITE + "/live/",
            "provider": {"@id": SITE + "/#organization"},
            "areaServed": "Europe",
            "description": PAGES["live/index.html"]["description"],
        }
    else:
        return ""
    return '  <script type="application/ld+json">\n' + json.dumps(data, ensure_ascii=False, indent=2) + "\n  </script>\n"


def head(cfg):
    canonical = SITE + cfg["path"]
    body_attr = f' data-page="{cfg["page"]}"' if cfg["page"] else ""
    keywords = f'  <meta name="keywords" content="{cfg["keywords"]}" />\n' if cfg["keywords"] else ""
    return f"""<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{cfg["title"]}</title>
  <meta name="description" content="{cfg["description"]}" />
{keywords}  <link rel="canonical" href="{canonical}" />
  <link rel="icon" href="/images/linto.svg" />
  <link rel="stylesheet" href="/style.css" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="LinTO Studio" />
  <meta property="og:title" content="{cfg["title"]}" />
  <meta property="og:description" content="{cfg["description"]}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="{SITE}/screenshot.png" />
  <meta name="twitter:card" content="summary_large_image" />
{jsonld(cfg["jsonld"])}</head>

<body{body_attr}>
"""


def tail(cfg):
    scripts = "".join(f'  <script src="{s}"></script>\n' for s in cfg["scripts"])
    return (
        '  <script src="https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js"></script>\n'
        '  <script src="/js/i18n.js"></script>\n'
        '  <script src="/js/contact.js"></script>\n'
        '  <script src="/js/cookies.js"></script>\n'
        + scripts
        + (ROOT / "_matomo.html").read_text()
        + "</body>\n</html>\n"
    )


def mark_nav(header, nav):
    if not nav:
        return header
    return header.replace(f'data-nav="{nav}"', f'data-nav="{nav}" class="active"')


def main():
    header = (ROOT / "_header.html").read_text()
    footer = (ROOT / "_footer.html").read_text()
    for out, cfg in PAGES.items():
        body = (ROOT / cfg["body"]).read_text()
        html = head(cfg) + mark_nav(header, cfg["nav"]) + body + footer + tail(cfg)
        path = ROOT / out
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(html)
        print("wrote", out, len(html))

    urls = "".join(
        f"  <url><loc>{SITE}{cfg['path']}</loc></url>\n" for cfg in PAGES.values()
    )
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n"
    )
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /runtime/\nDisallow: /save/\n\nSitemap: {SITE}/sitemap.xml\n")
    print("wrote sitemap.xml robots.txt")


if __name__ == "__main__":
    os.chdir(ROOT)
    main()
