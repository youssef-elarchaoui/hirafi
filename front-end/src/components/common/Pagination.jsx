import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
    const getPageNumbers = () => {
        const totalNumbers = siblingCount * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages <= totalBlocks) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const showLeftDots = leftSiblingIndex > 2;
        const showRightDots = rightSiblingIndex < totalPages - 1;

        if (!showLeftDots && showRightDots) {
            const leftItems = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItems }, (_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }

        if (showLeftDots && !showRightDots) {
            const rightItems = 3 + 2 * siblingCount;
            const rightRange = Array.from({ length: rightItems }, (_, i) => totalPages - rightItems + i + 1);
            return [1, '...', ...rightRange];
        }

        if (showLeftDots && showRightDots) {
            const middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            );
            return [1, '...', ...middleRange, '...', totalPages];
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-btn border border-border dark:border-border-dark hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <FiChevronLeft size={16} />
            </button>

            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`dots-${index}`} className="px-3 py-1 text-text-secondary">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded-btn transition-colors ${
                            currentPage === page
                                ? 'bg-primary text-white'
                                : 'border border-border dark:border-border-dark hover:border-primary'
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-btn border border-border dark:border-border-dark hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <FiChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;