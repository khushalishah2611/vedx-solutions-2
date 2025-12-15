export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve('');

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });

export default fileToDataUrl;
