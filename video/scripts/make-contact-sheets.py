#!/usr/bin/env python3
"""
Renders and stitches visual proof contact sheets for PayPal Sentinel:
  1. docs/video/exports/callouts-middle-frames.png
  2. docs/video/exports/motion-frames.png
"""
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

VIDEO = Path(__file__).resolve().parent.parent
EXPORTS = Path("/Volumes/Dev/paypal-ai-hackathon/projects/project_1/docs/video/exports")
STILLS_DIR = VIDEO / "out" / "contact-stills"
EXPORTS.mkdir(parents=True, exist_ok=True)
STILLS_DIR.mkdir(parents=True, exist_ok=True)

MASTER_MP4 = EXPORTS / "paypal-sentinel-hackathon-master.mp4"
LAUNCH_MP4 = EXPORTS / "paypal-sentinel-x-launch.mp4"

CALLOUT_TIMESTAMPS = [
    (MASTER_MP4, 16.0, "C1 · S03 (0:16) 1-Click Judge Sandbox & 6 Sponsor Stack"),
    (MASTER_MP4, 34.0, "C2 · S05 (0:34) PayPal + AI Pattern Studio (5 Tracks & 12 Patterns)"),
    (MASTER_MP4, 62.0, "C3 · S07 (1:02) Server-to-Server Orders v2 Capture (*1881)"),
    (MASTER_MP4, 88.0, "C4 · S09 (1:28) Deterministic Overspend ($850) & 409 Locks"),
    (MASTER_MP4, 110.0, "C5 · S11 (1:50) @paypal/mcp Inspector & Dispute Evidence Shield"),
    (MASTER_MP4, 130.0, "C6 · S13 (2:10) AG Grid v36 & Self-Serve Studio KPI Agent"),
    (MASTER_MP4, 150.0, "C7 · S15 (2:30) Bryntum Resource Timeline & 1-Click DELIVERED"),
    (LAUNCH_MP4, 12.0, "X1 · X02 (0:12) Channel3 Search & Direct Card *1881 Capture"),
    (LAUNCH_MP4, 24.0, "X2 · X03 (0:24) $850 Overspend Block & Duplicate 409 Lock"),
]

MOTION_TIMESTAMPS = [
    (MASTER_MP4, 4.0, "S01 · OrbSwarm 4-Beat Hook (AI buys for you)"),
    (MASTER_MP4, 10.0, "S02 · BlockWordmark + PayPal Sentinel Emblem"),
    (MASTER_MP4, 14.0, "S03 · LaptopFrame 3D Perspective Tilt Dive"),
    (MASTER_MP4, 25.0, "S04 · Chapter Tracks WordGather (5 Devpost Tracks)"),
    (MASTER_MP4, 38.0, "S05 · Pattern Studio Live Sandbox Settle"),
    (MASTER_MP4, 53.0, "S06 · PunchLines (Channel3 Index, $500 Rust Cap)"),
    (MASTER_MP4, 66.0, "S07 · Settled PayPal Order *1881 ($425 -> $870)"),
    (MASTER_MP4, 80.0, "S08 · Red-Team $850 Overspend Block Alert ($0.00)"),
    (MASTER_MP4, 112.0, "S11 · @paypal/mcp Inspector & Dispute Shield"),
    (MASTER_MP4, 128.0, "S13 · AG Studio Enterprise Grid (AgGridReact v36)"),
    (MASTER_MP4, 148.0, "S15 · Bryntum Timeline & 1-Click DELIVERED Proof"),
    (MASTER_MP4, 162.0, "S16 · PayPal Sentinel End Lockup & MIT Open Source"),
]

def extract_stills(items, prefix):
    results = []
    for idx, (video_path, t, label) in enumerate(items):
        out_png = STILLS_DIR / f"{prefix}-{idx:02d}.png"
        subprocess.run([
            "ffmpeg", "-y", "-ss", str(t), "-i", str(video_path),
            "-vframes", "1", "-q:v", "2", str(out_png)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        results.append((out_png, label))
    return results

def stitch_sheet(items, cols, thumb_w, out_path):
    thumb_h = round(thumb_w * 9 / 16)
    label_h = 32
    pad = 16
    rows = (len(items) + cols - 1) // cols
    sheet_w = pad + cols * (thumb_w + pad)
    sheet_h = pad + rows * (thumb_h + label_h + pad)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (6, 8, 12))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Menlo.ttc", 15)
    except Exception:
        font = ImageFont.load_default()

    for i, (img_path, label) in enumerate(items):
        r = i // cols
        c = i % cols
        x = pad + c * (thumb_w + pad)
        y = pad + r * (thumb_h + label_h + pad)
        im = Image.open(img_path).convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(im, (x, y))
        draw.rectangle([x, y, x + thumb_w - 1, y + thumb_h - 1], outline=(149, 249, 101), width=2)
        draw.text((x + 6, y + thumb_h + 6), label, fill=(242, 243, 238), font=font)

    sheet.save(out_path, optimize=True)
    print(f"Wrote contact sheet: {out_path} ({sheet_w}x{sheet_h})")

if __name__ == "__main__":
    print("Extracting Callout frames...")
    callout_stills = extract_stills(CALLOUT_TIMESTAMPS, "callout")
    stitch_sheet(callout_stills, cols=3, thumb_w=600, out_path=EXPORTS / "callouts-middle-frames.png")

    print("Extracting Motion frames...")
    motion_stills = extract_stills(MOTION_TIMESTAMPS, "motion")
    stitch_sheet(motion_stills, cols=3, thumb_w=600, out_path=EXPORTS / "motion-frames.png")
