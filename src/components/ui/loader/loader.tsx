import { twMerge } from 'tailwind-merge';
interface Props {
  className?: string;
  text?: string;
  showText?: boolean;
}

interface LoaderIconProps {
  className?: string;
  size?: number;
}

export const LoaderIcon = ({ className, size = 80 }: LoaderIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 0 200 200"
      className={className}
    >
      <radialGradient
        id="a7"
        cx=".66"
        fx=".66"
        cy=".3125"
        fy=".3125"
        gradientTransform="scale(1.5)"
      >
        <stop offset="0" stopColor="#FF5C35"></stop>
        <stop offset=".3" stopColor="#FF5C35" stopOpacity=".9"></stop>
        <stop offset=".6" stopColor="#FF5C35" stopOpacity=".6"></stop>
        <stop offset=".8" stopColor="#FF5C35" stopOpacity=".3"></stop>
        <stop offset="1" stopColor="#FF5C35" stopOpacity="0"></stop>
      </radialGradient>
      <circle
        transformOrigin="center"
        fill="none"
        stroke="url(#a7)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray="200 1000"
        strokeDashoffset="0"
        cx="100"
        cy="100"
        r="70"
      >
        <animateTransform
          type="rotate"
          attributeName="transform"
          calcMode="spline"
          dur="2"
          values="360;0"
          keyTimes="0;1"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>
      <circle
        transformOrigin="center"
        fill="none"
        opacity=".2"
        stroke="#FF5C35"
        strokeWidth="16"
        strokeLinecap="round"
        cx="100"
        cy="100"
        r="70"
      ></circle>
    </svg>
  );
};
const Loader = ({
  className,
  showText = true,
  text = 'Loading...'
}: Props) => {
  return (
    <div
      className={twMerge(
        'w-full flex flex-col items-center justify-center h-screen',
        className
      )}
    >
      <div>
        <LoaderIcon />
      </div>
      {showText && (
        <div className="text-lg font-semibold italic text-body">
          {text}
        </div>
      )}
    </div>
  );
};

export default Loader;
