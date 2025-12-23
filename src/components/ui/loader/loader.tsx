// import { twMerge } from 'tailwind-merge';
// import styles from './loader.module.css';
// import classNames from 'classnames';

// interface Props {
//   className?: string;
//   text?: string;
//   showText?: boolean;
//   simple?: boolean;
// }

// const Loader = (props: Props) => {
//   const { className, showText = true, text = 'Loading...', simple } = props;
//   return (
//     <>
//       {simple ? (
//         <div className={classNames(className, styles?.simple_loading)} />
//       ) : (
//         <div
//           className={twMerge(
//             classNames('w-full flex flex-col items-center justify-center h-[calc(100vh-200px)]', className),
//           )}
//         >
//           <div className={styles?.loading} />

//           {showText && (
//             <div className="text-lg font-semibold text-body italic">{text}</div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Loader;


import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  text?: string;
  showText?: boolean;
  simple?: boolean;
}

const Loader = ({
  className,
  showText = true,
  text = 'Loading...',
  simple,
}: Props) => {
  if (simple) {
    return (
      <div
        className={twMerge(
          'h-6 w-6 rounded-full border-2 border-emerald-500/30 border-t-emerald-600 animate-spin',
          className
        )}
      />
    );
  }

  return (
    <div
      className={twMerge(
        'w-full flex flex-col items-center justify-center h-[calc(100vh-200px)]',
        className
      )}
    >
      <div className="mb-3 h-10 w-10 rounded-full border-4 border-emerald-500/30 border-t-emerald-600 animate-spin" />

      {showText && (
        <div className="text-lg font-semibold italic text-gray-600">
          {text}
        </div>
      )}
    </div>
  );
};

export default Loader;
