const Avatar = ({ src, type='rounded-full', className }, ref) => {

  const avatarType = () => {
    switch (type) {
      case 'red':
        return 'rounded';
        break;
      case 'bordered':
        return 'rounded-full ring-2 ring-gray-300 dark:ring-gray-500';
        break;
      default:
        return 'rounded-full';
    }
  }
  return (
    <img ref={ref} class={classNames("w-15", className, avatarType())} src={src} />
  );
};
