from PIL import Image
import sys

def make_white_transparent(image_path, output_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # Check if the pixel is white or very close to white
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0)) # Set it to transparent
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print(f"Failed: {e}")
        sys.exit(1)

make_white_transparent('assets/images/logoKost.png', 'assets/images/logoKostTransparent.png')
