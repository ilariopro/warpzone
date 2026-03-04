import { useSearchParams } from 'react-router-dom';
import { Metadata } from '@warpzone/shared-schemas';
import { Button } from './button';

const Pagination = ({ count, page, pageSize, total, totalPages }: Metadata) => {
  const [, setSearchParams] = useSearchParams();
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : page;
  const previousPage = hasPreviousPage ? page - 1 : page;

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white py-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          {total === 0 ? (
            'No results'
          ) : (
            <>
              {'Page '}
              <span className="font-medium">{page}</span>
              {' of '}
              <span className="font-medium">{totalPages}</span>
              {' » Showing '}
              <span className="font-medium">{count}</span>
              {' of '}
              <span className="font-medium">{total}</span> {total !== 1 ? 'results' : 'result'}
            </>
          )}
        </p>
      </div>
      <div className="flex flex-1 justify-between items-center sm:justify-end">
        <Button
          className="relative inline-flex"
          disabled={!hasPreviousPage}
          onClick={() => setSearchParams({ page: `${previousPage}`, pageSize: `${pageSize}` })}
          variant="neutral"
        >
          Previous
        </Button>
        <div className="block sm:hidden ml-3 mr-auto">
          <p className="text-sm text-gray-700">
            {total === 0 ? (
              'No results'
            ) : (
              <>
                {'Page '}
                <span className="font-medium">{page}</span>
                {' of '}
                <span className="font-medium">{totalPages}</span>
              </>
            )}
          </p>
        </div>
        <Button
          className="relative ml-3 inline-flex"
          disabled={!hasNextPage}
          onClick={() => setSearchParams({ page: `${nextPage}`, pageSize: `${pageSize}` })}
          variant="neutral"
        >
          Next
        </Button>
      </div>
    </nav>
  );
};

export { Pagination };
