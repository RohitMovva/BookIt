import os
from tkinter import filedialog, Tk
from shutil import copy2

def upload_image():
    # Create and hide the Tkinter root window
    root = Tk()
    root.withdraw()

    # Open file dialog for image selection
    file_types = [
        ('Image files', '*.png *.jpg *.jpeg *.gif *.bmp *.tiff')
    ]
    file_path = filedialog.askopenfilename(
        title='Select an image file',
        filetypes=file_types
    )

    if file_path:
        # Define the destination directory
        dest_dir = r'C:\Users\tihor\Projects\BookIt\backend\static\uploads\images'
        
        # Create directory if it doesn't exist
        os.makedirs(dest_dir, exist_ok=True)
        
        # Get the original filename
        filename = os.path.basename(file_path)
        
        # Create the destination path
        dest_path = os.path.join(dest_dir, filename)
        
        try:
            # Copy the file to destination
            copy2(file_path, dest_path)
            print(f"Image successfully saved to: {dest_path}")
            return dest_path
        except Exception as e:
            print(f"Error saving the image: {e}")
            return None
    else:
        print("No file selected")
        return None

if __name__ == "__main__":
    uploaded_path = upload_image()
    