"""
build.py

Automates the process of building the Startpage Manager into a standalone Windows executable.
It uses PyInstaller to bundle the Python script and the application icon into a single .exe file,
allowing users without Python installed to run the manager tool.
"""

import os
import subprocess
import sys
import shutil

def build_exe():
    print("========================================")
    print("🚀 Startpage Manager Executable Builder")
    print("========================================\n")
    
    # Ensure build dependencies
    try:
        import PyInstaller
    except ImportError:
        print("⚙️  PyInstaller not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
    
    icon_path = os.path.abspath(os.path.join("img", "app-icon.ico"))
    
    cmd = [
        sys.executable, "-m", "PyInstaller",
        "--onefile",
        "--noconsole",
        "--name", "StartpageManager",
        "--clean"
    ]
    
    if os.path.exists(icon_path):
        print(f"🎨 Found custom icon at {icon_path}. Bundling with executable...")
        # Add icon to EXE metadata
        cmd.extend([f"--icon={icon_path}"])
        # Bundle icon into the EXE payload so tkinter can use it at runtime
        # PyInstaller syntax for add-data is 'source;dest' on Windows
        cmd.extend(["--add-data", f"{icon_path};img"])
    else:
        print("⚠️  Warning: No valid 'app-icon.ico' found.")
        print("   Executable will use default icon.")
        print("   Tip: Run 'python scripts/build_icon.py' first to generate it from the SVG.")
    
    cmd.append(os.path.join("scripts", "manager.py"))
    
    print("\n📦 Compiling... (This may take a minute)\n")
    
    try:
        # Run PyInstaller silently unless an error occurs
        subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        
        # Cleanup PyInstaller temp folders
        print("🧹 Cleaning up temporary build files...")
        if os.path.exists("build"):
            shutil.rmtree("build")
        if os.path.exists("StartpageManager.spec"):
            os.remove("StartpageManager.spec")
            
        print("\n✅ Build complete! You can find 'StartpageManager.exe' in the 'dist' folder.")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Build failed! Error output:")
        print(e.output.decode('utf-8', errors='ignore'))
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    build_exe()
