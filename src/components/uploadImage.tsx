// TODO - Better scoped styles?!
import styles from '@/app/page.module.css';

const UploadImage = ({
  handleFileChange,
}: {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div>
      <label htmlFor='fileSelect' className={styles.uploadButtonLabel}>
        Upload an image
      </label>
      <input
        id='fileSelect'
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        hidden
      />
    </div>
  );
};

export { UploadImage };
