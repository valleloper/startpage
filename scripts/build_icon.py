"""
build_icon.py

A standalone utility script that converts the primary vector graphics icon (app-icon.svg) 
into a multi-resolution Windows Icon file (app-icon.ico). This ensures the application 
always has high-quality icons available for browser tabs, desktop shortcuts, and executables.
"""

import os
import sys
import subprocess

def build_icon():
    print("🎨 Attempting to generate app-icon.ico from SVG...")
    svg_path = os.path.join(os.path.dirname(__file__), "..", "img", "app-icon.svg")
    ico_path = os.path.join(os.path.dirname(__file__), "..", "img", "app-icon.ico")
    temp_png = os.path.join(os.path.dirname(__file__), "..", "img", "temp_icon.png")
    
    if not os.path.exists(svg_path):
        print(f"Error: {svg_path} not found.")
        sys.exit(1)
        
    try:
        # Check for conversion libraries
        try:
            from svglib.svglib import svg2rlg
            from reportlab.graphics import renderPM
            from PIL import Image
        except ImportError:
            print("Missing conversion libraries. Installing svglib, reportlab & pillow...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "svglib", "reportlab", "pillow"])
            from svglib.svglib import svg2rlg
            from reportlab.graphics import renderPM
            from PIL import Image
        
        # 1. Convert SVG to high-res PNG first
        drawing = svg2rlg(svg_path)
        drawing.width = 512
        drawing.height = 512
        renderPM.drawToFile(drawing, temp_png, fmt="PNG")
        
        # 2. Convert PNG to ICO with multiple sizes
        img = Image.open(temp_png)
        icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
        img.save(ico_path, sizes=icon_sizes)
        
        # 3. Cleanup temp file
        if os.path.exists(temp_png):
            os.remove(temp_png)
            
        print(f"✅ Successfully generated {ico_path}")
    except Exception as e:
        print(f"❌ Could not convert SVG to ICO: {e}")

if __name__ == "__main__":
    build_icon()
