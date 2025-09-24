import { Link } from '@/components/ui/link';
import { Chevron } from '@/assets/icons/Chevron';
import { getBreadcrumbs } from '@/utils/GenerateUrl';

export const Breadcrumb = () => {
  const breadcrumbs =  getBreadcrumbs()

  return (
    <div className="text-xs">
      <ol className="flex dark:text-white flex-wrap">
        {breadcrumbs.map((breadcrumb: any, index: any) => {
          return (
            <li key={index} className="flex items-center">
              <Link
                className={`capitalize hover:underline ${index == 0
                  ? "!text-[var(--sidebar-text-color)]"
                  : "!text-[var(--sidebar-text-color)] opacity-90"
                  } hover:text-[var(--sidebar-text-color)] opacity-90 dark:!text-white hover:opacity-90`}
                to={breadcrumb?.path}
              >
                {breadcrumb?.name}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-1 text-[var(--sidebar-text-color)] dark:text-white">
                  <Chevron className="rotate-180 origin-center -webkit-transform" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
