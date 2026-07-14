#!/usr/bin/env python3
"""《大家的日本语 初级Ⅰ》(minna1.pdf) 解析管线 — 第一步：OCR 与课程边界探测

用法：
  python3 scripts/parse-minna.py ocr        # 全书逐页 OCR（缓存，可断点续跑）
  python3 scripts/parse-minna.py detect     # 从 OCR 缓存探测 第1課～第25課 页码边界
  python3 scripts/parse-minna.py page N     # 查看第 N 页 OCR 文本（人工核对用）

真实性原则：
- 本 PDF 为扫描版（无文本层），OCR 结果必然含错——因此 OCR 产物只作为
  "待审核底稿"，绝不直接写入 verified 数据；课程边界、词表、语法条目
  都必须经人工在审核工作台对照原书核实。
- OCR 缓存目录 (resources/textbooks/minna/beginner1/ocr/) 已列入
  .gitignore：整本教材受版权保护，其全文不应提交进公开仓库、
  更不应随 GitHub Pages 发布。
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / 'resources/textbooks/minna/beginner1/minna1.pdf'
OCR_DIR = ROOT / 'resources/textbooks/minna/beginner1/ocr'
DPI = 150


def ocr_all():
    import fitz
    OCR_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF)
    for i in range(doc.page_count):
        out = OCR_DIR / f'page-{i + 1:03d}.txt'
        if out.exists() and out.stat().st_size > 0:
            continue
        png = OCR_DIR / 'tmp.png'
        doc[i].get_pixmap(dpi=DPI).save(png)
        subprocess.run(
            ['tesseract', str(png), str(out.with_suffix('')), '-l', 'jpn', '--psm', '3'],
            capture_output=True)
        print(f'page {i + 1}/{doc.page_count} ok', flush=True)
    (OCR_DIR / 'tmp.png').unlink(missing_ok=True)


# 第N課 标题的各种 OCR 变体（課 常被误读为 課/课/謀/線 等，数字可为全角/汉字）
KANJI_NUM = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10}
LESSON_PAT = re.compile(r'第\s*([0-9０-９一二三四五六七八九十]{1,3})\s*[課课誤謀]')


def parse_num(s):
    s = s.translate(str.maketrans('０１２３４５６７８９', '0123456789'))
    if s.isdigit():
        return int(s)
    # 汉字数字：十/二十/二十五 等
    n, tens = 0, s.split('十')
    if len(tens) == 2:
        n = (KANJI_NUM.get(tens[0], 1) if tens[0] else 1) * 10 + (KANJI_NUM.get(tens[1], 0) if tens[1] else 0)
    else:
        n = KANJI_NUM.get(s, 0)
    return n


def detect():
    hits = {}
    for f in sorted(OCR_DIR.glob('page-*.txt')):
        page = int(f.stem.split('-')[1])
        head = f.read_text(errors='ignore')[:300]  # 课标题都在页面顶部
        for m in LESSON_PAT.finditer(head):
            n = parse_num(m.group(1))
            if 1 <= n <= 25 and n not in hits:
                hits[n] = page
    print('探测到的课程起始页（PDF页码，待人工核实）:')
    for n in sorted(hits):
        print(f'  第{n:02d}課 → page {hits[n]}')
    missing = [n for n in range(1, 26) if n not in hits]
    if missing:
        print('未探测到（需人工定位）:', missing)
    return hits


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'detect'
    if cmd == 'ocr':
        ocr_all()
    elif cmd == 'detect':
        detect()
    elif cmd == 'page':
        print((OCR_DIR / f'page-{int(sys.argv[2]):03d}.txt').read_text(errors='ignore'))
