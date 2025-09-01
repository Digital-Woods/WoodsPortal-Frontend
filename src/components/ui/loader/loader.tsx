import { twMerge } from 'tailwind-merge';
import styles from './loader.module.css';
import classNames from 'classnames';

interface Props {
  className?: string;
  text?: string;
  showText?: boolean;
  simple?: boolean;
}

const Loader = (props: Props) => {
  const { className, showText = true, text = 'Loading...', simple } = props;
  return (
    <>
      {simple ? (
        <div className={classNames(className, styles.simple_loading)} />
      ) : (
        <div
          className={twMerge(
            classNames('w-full flex flex-col items-center justify-center h-[calc(100vh-200px)]', className),
          )}
        >
          <div className={styles.loading} />

          {showText && (
            <div className="text-lg font-semibold text-body italic">{text}</div>
          )}
        </div>
      )}
    </>
  );
};

export default Loader;
