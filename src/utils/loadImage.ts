const loadImage = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      if (event.target) {
        img.src = event.target.result as string;
      }
      img.onload = () => resolve(img);
    };
    reader.onerror = () => reject(new Error('Failed to read the file'));
    reader.readAsDataURL(file);
  });
};

export { loadImage };
