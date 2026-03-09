export default function BlogLoading() {
    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-16 animate-pulse">
                {/* Hero Skeleton (Similar to the slider shape) */}
                <div className="relative mb-24 lg:mb-32">
                    <div className="hidden lg:block w-full" style={{ paddingBottom: '45%' }}></div>
                    <div className="block lg:hidden w-full" style={{ paddingBottom: '120%' }}></div>

                    <div className="absolute inset-0 z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
                            {/* Image Skeleton */}
                            <div className="w-full lg:w-[85%] mx-auto lg:mx-0 h-[400px] sm:h-[500px] lg:h-full bg-zinc-200 dark:bg-zinc-800 rounded-[1.5rem] shadow-sm"></div>

                            {/* Content Skeleton */}
                            <div className="flex flex-col justify-center max-w-xl mx-auto lg:mx-0 w-full px-4 lg:px-0">
                                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-8 mx-auto lg:mx-0"></div>
                                <div className="h-12 lg:h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
                                <div className="h-12 lg:h-16 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-8 mx-auto lg:mx-0"></div>
                                <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-10 mx-auto lg:mx-0"></div>
                                <div className="h-12 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto lg:mx-0"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories & Search Skeleton */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center py-4 border-y border-zinc-200 dark:border-zinc-800">
                    <div className="flex gap-4">
                        <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                        <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                        <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                    </div>
                    <div className="h-10 w-full md:w-72 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex flex-col h-full">
                                <div className="aspect-[3/2] w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-6"></div>
                                <div className="h-7 w-full bg-zinc-200 dark:bg-zinc-800 rounded mb-3"></div>
                                <div className="h-7 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-6"></div>
                                <div className="space-y-2 mb-6">
                                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                                    <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                                </div>
                                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mt-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
