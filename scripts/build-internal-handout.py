"""Package current H01/H02 notes with local papers and an unchanged draft deck."""
import argparse
from datetime import date
from html import escape
from pathlib import Path
import re
import shutil
import zipfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak


def plain_wiki(text):
    return re.sub(r'\[\[([^]|]+)(?:\|([^]]+))?\]\]', lambda m: m.group(2) or m.group(1).rsplit('/', 1)[-1], text)


def note_body(path):
    lines = path.read_text().splitlines()
    if lines and lines[0].startswith('# '):
        lines = lines[1:]
    lines = [line for line in lines if line.strip() not in ('[[Pitch Presentation]]', '## TODO')]
    return plain_wiki('\n'.join(lines)).strip()


def inline(text):
    text = escape(text)
    text = re.sub(r'\[([^]]+)\]\(([^)]+)\)', lambda m: '<a href="' + m.group(2) + '" color="#18456B">' + m.group(1) + '</a>', text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'`([^`]+)`', r'<font name="Courier">\1</font>', text)
    return text


def render_pdf(markdown, dest, stamp):
    font_dir = Path('/System/Library/Fonts/Supplemental')
    for name, filename in [('Arial', 'Arial.ttf'), ('ArialBold', 'Arial Bold.ttf'), ('ArialItalic', 'Arial Italic.ttf'), ('ArialBoldItalic', 'Arial Bold Italic.ttf')]:
        pdfmetrics.registerFont(TTFont(name, str(font_dir / filename)))
    pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='ArialBold', italic='ArialItalic', boldItalic='ArialBoldItalic')
    styles = getSampleStyleSheet()
    base = dict(fontName='Arial', fontSize=11, leading=14.3, textColor=colors.black, spaceAfter=7)
    body = ParagraphStyle('BodyCopy', **base)
    title = ParagraphStyle('MainTitle', parent=body, fontName='ArialBold', fontSize=21, leading=25, spaceAfter=10)
    h1 = ParagraphStyle('SectionTitle', parent=body, fontName='ArialBold', fontSize=16, leading=20, spaceBefore=7, spaceAfter=10, keepWithNext=True)
    h2 = ParagraphStyle('Subheading', parent=body, fontName='ArialBold', fontSize=12, leading=16, spaceBefore=9, spaceAfter=6, keepWithNext=True)
    bullet = ParagraphStyle('BodyBullet', parent=body, leftIndent=12, firstLineIndent=0, bulletIndent=0, spaceAfter=6)
    cell = ParagraphStyle('TableBody', parent=body, fontSize=10.8, leading=14, spaceAfter=0)
    header = ParagraphStyle('TableHeading', parent=cell, fontName='ArialBold', textColor=colors.white)
    story = []
    lines = markdown.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if line == '<!-- pagebreak -->':
            story.append(PageBreak())
        elif line.startswith('# '):
            story.append(Paragraph(inline(line[2:]), title))
        elif line.startswith('## '):
            story.append(Paragraph(inline(line[3:]), h1))
        elif line.startswith('### '):
            story.append(Paragraph(inline(line[4:]), h2))
        elif line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                values = [v.strip() for v in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', v) for v in values):
                    rows.append(values)
                i += 1
            data = [[Paragraph(inline(c), header if r == 0 else cell) for c in row] for r, row in enumerate(rows)]
            table = Table(data, colWidths=[118, A4[0]-108-118], repeatRows=1, hAlign='LEFT')
            commands = [('BACKGROUND', (0,0), (-1,0), colors.HexColor('#29445A')), ('GRID',(0,0),(-1,-1),0.5,colors.HexColor('#D9D9D9')), ('VALIGN',(0,0),(-1,-1),'MIDDLE'), ('LEFTPADDING',(0,0),(-1,-1),9), ('RIGHTPADDING',(0,0),(-1,-1),9), ('TOPPADDING',(0,0),(-1,-1),9), ('BOTTOMPADDING',(0,0),(-1,-1),9)]
            for r in range(2, len(data), 2):
                commands.append(('BACKGROUND', (0,r), (-1,r), colors.HexColor('#F1F4F6')))
            table.setStyle(TableStyle(commands))
            story.extend([table, Spacer(1, 10)])
            continue
        elif line.startswith('- '):
            story.append(Paragraph(inline(line[2:]), bullet, bulletText='-'))
        else:
            parts = [line.lstrip('> ').strip() if line.startswith('>') else line]
            while i+1 < len(lines) and lines[i+1].strip() and not re.match(r'^(#|\||- |<!--)', lines[i+1].strip()):
                i += 1
                parts.append(lines[i].strip().lstrip('> '))
            story.append(Paragraph(inline(' '.join(parts)), body))
        i += 1
    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Arial', 8)
        canvas.setFillColor(colors.HexColor('#666666'))
        canvas.drawString(54, 29, 'Internal research snapshot  |  ' + stamp)
        canvas.drawRightString(A4[0]-54, 29, str(doc.page))
        canvas.restoreState()
    doc = SimpleDocTemplate(str(dest), pagesize=A4, rightMargin=54, leftMargin=54, topMargin=43, bottomMargin=48, title='AscendNPU-IR optimization research', author='')
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--vault', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--presentation-pptx', type=Path, required=True)
    parser.add_argument('--presentation-pdf', type=Path, required=True)
    parser.add_argument('--date', required=True)
    args = parser.parse_args()
    stamp = date.fromisoformat(args.date).strftime('%d %B %Y').lstrip('0')
    vault, out = args.vault, args.output
    out.mkdir(parents=True, exist_ok=True)
    (out/'papers').mkdir(exist_ok=True)
    (out/'presentation').mkdir(exist_ok=True)
    h01 = note_body(vault/'questions/H01 - What are we trying to do.md')
    h02 = note_body(vault/'questions/H02 - How is it done today.md')
    h02 = h02.replace('## ', '### ')
    h02 = h02.replace('A possible implication for the proposal is recorded in Framework-generated comparison references.', 'A possible implication for the proposal is included under Supporting material below.')
    hypothesis = (vault/'research/Framework-generated comparison references.md').read_text().splitlines()
    hypothesis = '\n'.join(line for line in hypothesis[1:] if not line.startswith('Context:')).strip()
    markdown = f'''# AscendNPU-IR optimization research

**Internal work in progress | {stamp}**

Current H01 and H02 notes for internal discussion. H01 records the objective; H02 remains a partial description of current practices. The attached presentation is an older, unreviewed AI-generated draft.

## H01 What are we trying to do

{h01}

<!-- pagebreak -->

## H02 How is it done today

{h02}

<!-- pagebreak -->

## Supporting material

### Framework generated comparison references

{hypothesis}

### Papers informing the work

- **LPO: Discovering Missed Peephole Optimizations with Large Language Models.** arXiv:2508.16125v2, 16 March 2026. Local PDF: `papers/LPO-2508.16125v2.pdf`. [Versioned paper record](https://arxiv.org/abs/2508.16125v2).
- **PRAGMA: A Profiling-Reasoned Multi-Agent Framework for Automatic Kernel Optimization.** arXiv:2511.06345v2, 24 November 2025. Local PDF: `papers/PRAGMA-2511.06345v2.pdf`. [Versioned paper record](https://arxiv.org/abs/2511.06345v2).

### Earlier AI generated presentation

The existing 25-slide presentation is included unchanged in `presentation/UNREVIEWED-AI-DRAFT.pptx` and `presentation/UNREVIEWED-AI-DRAFT.pdf`. It predates the rebuilt vault and contains assumptions that have not been adopted as project decisions. Use it as background while reading the current notes above.
'''
    markdown = markdown.replace('—', '-').replace('–', '-').replace('\u2011', '-')
    (out/'Research overview.md').write_text(markdown)
    render_pdf(markdown, out/'Research overview.pdf', stamp)
    for filename in ['LPO-2508.16125v2.pdf', 'PRAGMA-2511.06345v2.pdf']:
        shutil.copyfile(vault/'attachments/papers'/filename, out/'papers'/filename)
    shutil.copyfile(args.presentation_pptx, out/'presentation/UNREVIEWED-AI-DRAFT.pptx')
    shutil.copyfile(args.presentation_pdf, out/'presentation/UNREVIEWED-AI-DRAFT.pdf')
    (out/'README.md').write_text(f'''# Internal research handout

Snapshot for internal discussion, {stamp}.

1. Read **Research overview.pdf**: current H01/H02, open questions and the supporting hypothesis. The Markdown file is the editable reading-note source.
2. The **papers/** directory contains the full LPO and PRAGMA PDFs in the versions cited in the overview.
3. The **presentation/** directory contains the earlier AI-generated draft in PowerPoint and PDF formats. It is unreviewed historical material, not an agreed specification. Both files were copied unchanged from the previous research workspace.

H01 was accepted in discussion. H02 remains a draft. This package preserves the current working copies, including manual edits; it does not resolve open questions or select implementation methods.

## Source notes

- `questions/H01 - What are we trying to do.md`
- `questions/H02 - How is it done today.md`
- `research/Framework-generated comparison references.md`
- Earlier presentation: `ascend-optimization-discovery/output/technical-proposal-final.pptx` and `technical-proposal-preview.pdf`.
''')
    archive = Path(str(out)+'.zip')
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for file in sorted(out.rglob('*')):
            if file.is_file():
                z.write(file, str(Path(out.name)/file.relative_to(out)))
    print('Package:', out)
    print('Archive:', archive)


if __name__ == '__main__':
    main()
