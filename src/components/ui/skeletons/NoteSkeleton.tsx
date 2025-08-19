import { Button } from '@/components/ui/Button'
import { IconPlus } from '@/assets/icons/IconPlus'
import { recorBtnCustom } from '@/data/hubSpotData'

export const NoteSkeleton = () => {
    return (
        <div className="rounded-lg mt-2 bg-cleanWhite border dark:border-none dark:bg-dark-300 md:p-4 p-2 ">
            <div className="flex justify-end mb-6 items-center">
                <Button  variant={!recorBtnCustom ? 'default' : 'create'} className="text-white">
                    <span className="mr-2">
                        {" "}
                        <IconPlus className="!w-3 !h-3" />{" "}
                    </span>{" "}
                    Create Note
                </Button>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
                <div className="mt-2 animate-pulse" key={i}>
                    <div
                        className="border border-gray-200 dark:border-gray-600 dark:bg-dark-500 bg-white shadow-md rounded-md mt-1 p-2 dark:text-white text-sm cursor-pointer">
                        <div>
                            <div className="flex items-center gap-2">
                                <div>
                                    <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[16px] inline-block "></span>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-sm font-semibold  whitespace-nowrap">
                                        <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[100px] inline-block "></span>
                                    </p>
                                    <div>
                                        <p className="text-gray-400 dark:text-white text-xs ">
                                            <span className="h-2 bg-gray-300 dark:bg-dark-white rounded-sm w-[80px] inline-block "></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div
                                    className={`py-3 pr-3 pl-6 hover:border-blue-500 hover:bg-gray-100 hover:dark:bg-gray-600 rounded-md relative group`
                                    }
                                >
                                    <div className={"relative line-clamp-2"}>
                                        <span className="flex flex-col gap-3">
                                            <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[150px] inline-block "></span>

                                            <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[250px] inline-block "></span>

                                            <span className="h-3 bg-gray-300 dark:bg-dark-white rounded-sm w-[180px] inline-block "></span>
                                        </span>
                                        <div
                                            className={`bg-gradient-to-t from-white dark:from-dark-500 to-transparent h-8 absolute bottom-0 right-0 left-0`}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}