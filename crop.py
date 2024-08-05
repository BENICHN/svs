import sys
from pathlib import Path
from pypdf import *
from pypdf.generic import *

if (len(sys.argv)<3):
    print('usage: python crop.py <pdf_file> <width_mm> <height_mm>')
    exit(0)

path = sys.argv[1]
pdf = PdfReader(path)
out = PdfWriter()

mm_to_pt = 2.8346456693
w_mm = float(sys.argv[2])
h_mm = float(sys.argv[3])

w_pt = w_mm * mm_to_pt
h_pt = h_mm * mm_to_pt

for i, page in enumerate(pdf.pages):
    t, l, b, r = page.cropbox.top, page.cropbox.left, page.cropbox.bottom, page.cropbox.right
    w = r
    h = t
    page.mediabox = RectangleObject((0, h-h_pt, w_pt, h))
    out.add_page(page)
    print(f'ok page {i}')
    
out.write(f'{Path(path).with_suffix('')}_cropped.pdf')