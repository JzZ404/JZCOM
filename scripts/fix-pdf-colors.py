"""Keeps a PDF's colors true in Adobe Acrobat.

Chrome's PDFs leave the page's transparency blending space unset, so on any
page with transparency (shadows, soft edges) Acrobat blends in print (CMYK)
color, which dulls bright screen colors like Alio's indigo. This sets every
page to blend in screen RGB instead. The pixels themselves are untouched.

usage: python3 scripts/fix-pdf-colors.py file.pdf
"""

import sys

import pymupdf

path = sys.argv[1]
doc = pymupdf.open(path)
for page in doc:
    doc.xref_set_key(page.xref, "Group", "<< /Type /Group /S /Transparency /CS /DeviceRGB >>")
doc.save(path, incremental=True, encryption=pymupdf.PDF_ENCRYPT_KEEP)
print("fixed colors in", path)
