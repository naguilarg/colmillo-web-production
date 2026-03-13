
import os
from PIL import Image

def optimize_image(input_path, output_path, max_height=2000):
    try:
        if not os.path.exists(input_path):
            print(f"Error: Source file not found: {input_path}")
            return

        with Image.open(input_path) as img:
            # Calculate new width to maintain aspect ratio
            ratio = max_height / img.height
            new_width = int(img.width * ratio)
            
            # Resize
            img = img.resize((new_width, max_height), Image.Resampling.LANCZOS)
            
            # Save as WebP
            img.save(output_path, 'WEBP', quality=85)
            print(f"Optimized: {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error optimizing {input_path}: {e}")

# Paths
base_dir = r"D:\ANTIGRAVITY\WEB-TEST1"
pics_dir = os.path.join(base_dir, "pics")
assets_dir = os.path.join(base_dir, "src", "assets")

# Process Nacho Frame
optimize_image(
    os.path.join(pics_dir, "nacho-frame.png"),
    os.path.join(assets_dir, "nacho-frame.webp")
)

# Process Flo Frame
optimize_image(
    os.path.join(pics_dir, "flo-frame.png"),
    os.path.join(assets_dir, "flo-frame.webp")
)
