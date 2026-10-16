import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface ProductImage {
    id: number;
    url?: string | null;
    image?: string | null;
}
interface User {
    id?: number;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    avatar?: string | null;
}
interface Category {
    id: number;
    name: string;
}
interface Product {
    id: number;
    title: string;
    category?: Category | null;
    description?: string | null;
    price: number | string;
    status: boolean;
    created_at?: string | null;
    images?: ProductImage[];
    user?: User | null;
}
interface Review {
    id: number;
    review?: string | null;
    rating: number;
    created_at?: string | null;
    user?: User | null;
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface ReviewsPagination {
    data: Review[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}
interface ReviewMetrics {
    total: number;
    average_rating: number;
    five_star: number;
    with_comments: number;
    distribution: Record<string, number>;
}
interface Props {
    product: Product;
    reviews: ReviewsPagination;
    reviewMetrics: ReviewMetrics;
    filters: {
        search?: string;
        rating?: string | number;
        sort?: string;
        direction?: string;
        per_page?: string | number;
    };
}

const imageUrl = (image?: ProductImage) =>
    image?.url ||
    (image?.image
        ? `/storage/${image.image}`
        : '/backend/assets/images/placholder.png');
const userName = (user?: User | null, fallback = 'Unknown User') =>
    `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() ||
    user?.email ||
    fallback;
const formatPrice = (price: number | string) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price || 0));
const formatDate = (date?: string | null, long = false) =>
    date
        ? new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: long ? 'long' : 'short',
              day: 'numeric',
          })
        : 'N/A';
const stars = (rating: number) =>
    `${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}`;

export default function Show({
    product,
    reviews,
    reviewMetrics,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [rating, setRating] = useState(filters.rating || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const primaryImage = product.images?.[0];

    const visit = (overrides: Record<string, string | number> = {}) =>
        router.get(
            `/admin/product/show/${product.id}`,
            {
                search,
                rating,
                per_page: perPage,
                sort: filters.sort || 'created_at',
                direction: filters.direction || 'desc',
                ...overrides,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );

    useEffect(() => {
        const timeout = setTimeout(
            () =>
                router.get(
                    `/admin/product/show/${product.id}`,
                    {
                        search,
                        rating,
                        per_page: perPage,
                        sort: filters.sort || 'created_at',
                        direction: filters.direction || 'desc',
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                ),
            500,
        );

        return () => clearTimeout(timeout);
    }, [filters.direction, filters.sort, perPage, product.id, rating, search]);

    const sortBy = (column: string) =>
        visit({
            sort: column,
            direction:
                filters.sort === column && filters.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        });
    const sortIcon = (column: string) =>
        filters.sort === column
            ? filters.direction === 'asc'
                ? 'arrow_upward'
                : 'arrow_downward'
            : 'unfold_more';

    return (
        <>
            <Head title={product.title} />
            <div className="row">
                <div className="col-lg-4">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20 text-center">
                        <img
                            alt={product.title}
                            className="mb-3 border"
                            src={imageUrl(primaryImage)}
                            style={{
                                height: '180px',
                                objectFit: 'cover',
                                width: '100%',
                            }}
                        />
                        <h3 className="mb-1">{product.title}</h3>
                        <p className="mb-3 text-muted">
                            {formatPrice(product.price)}
                        </p>
                        <span
                            className={`badge fs-14 ${product.status ? 'bg-success' : 'bg-secondary'}`}
                        >
                            {product.status ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                            <h3 className="mb-20">Gallery</h3>
                            <div className="d-flex flex-wrap gap-2">
                                {product.images.map((image) => (
                                    <img
                                        alt={product.title}
                                        key={image.id}
                                        src={imageUrl(image)}
                                        style={{
                                            height: '72px',
                                            objectFit: 'cover',
                                            width: '72px',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-lg-8">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                            <h3 className="mb-0">Product Information</h3>
                            <div className="d-flex gap-2">
                                <Link
                                    className="btn btn-primary text-white"
                                    href={`/admin/product/edit/${product.id}`}
                                >
                                    Edit
                                </Link>
                                <Link
                                    className="btn btn-secondary"
                                    href="/admin/product"
                                >
                                    Back
                                </Link>
                            </div>
                        </div>
                        <div className="row">
                            {[
                                ['Product Title', product.title],
                                [
                                    'Category',
                                    product.category?.name || 'Uncategorized',
                                ],
                                [
                                    'Seller',
                                    userName(product.user, 'Unknown Seller'),
                                ],
                                ['Price', formatPrice(product.price)],
                                [
                                    'Created At',
                                    formatDate(product.created_at, true),
                                ],
                            ].map(([label, value]) => (
                                <div className="col-md-6 mb-4" key={label}>
                                    <label className="label fs-14 mb-2 text-muted">
                                        {label}
                                    </label>
                                    <div className="form-control bg-light">
                                        {value}
                                    </div>
                                </div>
                            ))}
                            <div className="col-md-12 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Description
                                </label>
                                <div
                                    className="form-control bg-light"
                                    style={{ minHeight: '140px' }}
                                >
                                    {product.description ||
                                        'No description provided'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {[
                    [
                        'Average Rating',
                        `${Number(reviewMetrics.average_rating).toFixed(1)} / 5`,
                        'star',
                        'warning',
                    ],
                    [
                        'Total Reviews',
                        reviewMetrics.total,
                        'reviews',
                        'primary',
                    ],
                    [
                        '5-Star Reviews',
                        reviewMetrics.five_star,
                        'hotel_class',
                        'success',
                    ],
                    [
                        'Written Reviews',
                        reviewMetrics.with_comments,
                        'comment',
                        'info',
                    ],
                ].map(([label, value, icon, color]) => (
                    <div className="col-sm-6 col-xl-3 mb-4" key={label}>
                        <div className="card rounded-10 h-100 border border-white bg-white p-20">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="fs-14 text-muted">
                                        {label}
                                    </span>
                                    <h3 className="mt-2 mb-0">{value}</h3>
                                </div>
                                <i
                                    className={`material-symbols-outlined fs-32 text-${color}`}
                                >
                                    {icon}
                                </i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card rounded-10 mb-4 border border-white bg-white">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                            <span className="fs-16 border-0 bg-transparent p-0 text-primary">
                                Seller Reviews
                            </span>
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <input
                                    className="form-control"
                                    placeholder="Search by name, email or comment"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ width: '250px', }}
                                />
                                <select
                                    className="form-select"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    style={{ width: '160px', padding: '14px' }}
                                >
                                    <option value="">All Ratings</option>
                                    {[5, 4, 3, 2, 1].map((value) => (
                                        <option key={value} value={value}>
                                            {value} Star
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-primary text-white"
                                    onClick={() => visit()}
                                    type="button"
                                >
                                    Filter
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setSearch('');
                                        setRating('');
                                        setPerPage(10);
                                        router.get(
                                            `/admin/product/show/${product.id}`,
                                        );
                                    }}
                                    type="button"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="default-table-area mx-minus-1 table-to-do-list">
                            <div className="table-responsive">
                                <table className="table w-100 align-middle">
                                    <thead>
                                        <tr>
                                            <th>Review ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>
                                                <button
                                                    className="border-0 bg-transparent p-0"
                                                    onClick={() =>
                                                        sortBy('rating')
                                                    }
                                                    type="button"
                                                >
                                                    Rating{' '}
                                                    <i className="material-symbols-outlined fs-16 align-middle">
                                                        {sortIcon('rating')}
                                                    </i>
                                                </button>
                                            </th>
                                            <th>
                                                <button
                                                    className="border-0 bg-transparent p-0"
                                                    onClick={() =>
                                                        sortBy('created_at')
                                                    }
                                                    type="button"
                                                >
                                                    Review Date{' '}
                                                    <i className="material-symbols-outlined fs-16 align-middle">
                                                        {sortIcon('created_at')}
                                                    </i>
                                                </button>
                                            </th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviews.data.length > 0 ? (
                                            reviews.data.map((review) => (
                                                <tr key={review.id}>
                                                    <td>#{review.id}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    alt={userName(
                                                                        review.user,
                                                                    )}
                                                                    className="rounded-circle"
                                                                    src={
                                                                        review
                                                                            .user
                                                                            ?.avatar
                                                                            ? `/${review.user.avatar}`
                                                                            : '/backend/assets/images/placholder.png'
                                                                    }
                                                                    style={{
                                                                        width: '35px',
                                                                        height: '35px',
                                                                        objectFit:
                                                                            'cover',
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="ms-12 flex-grow-1">
                                                                <h4 className="fw-medium fs-16 mb-0">
                                                                    {userName(
                                                                        review.user,
                                                                    )}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {review.user?.email ||
                                                            'N/A'}
                                                    </td>
                                                    <td>
                                                        <span className="text-warning">
                                                            {stars(
                                                                review.rating,
                                                            )}
                                                        </span>{' '}
                                                        {Number(
                                                            review.rating,
                                                        ).toFixed(1)}
                                                    </td>
                                                    <td>
                                                        {formatDate(
                                                            review.created_at,
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div
                                                            className="d-flex justify-content-end"
                                                            style={{
                                                                gap: '12px',
                                                            }}
                                                        >
                                                            <button
                                                                className="hover-text-success border-0 bg-transparent p-0"
                                                                onClick={() =>
                                                                    setSelectedReview(
                                                                        review,
                                                                    )
                                                                }
                                                                type="button"
                                                            >
                                                                <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                    Visibility
                                                                </i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    className="py-5 text-center"
                                                    colSpan={6}
                                                >
                                                    No reviews found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20 pt-20">
                                <span className="fs-14 text-muted">
                                    Showing {reviews.from ?? 0} -{' '}
                                    {reviews.to ?? 0} of {reviews.total} reviews
                                </span>
                                <ul className="pagination mb-0">
                                    {reviews.links.map((link, index) => (
                                        <li
                                            key={index}
                                            className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                        >
                                            <button
                                                type="button"
                                                className="page-link"
                                                disabled={!link.url}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url, {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedReview && (
                <div
                    className="modal fade show d-block"
                    role="dialog"
                    aria-modal="true"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setSelectedReview(null)}
                >
                    <div
                        className="modal-dialog modal-lg modal-dialog-centered"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Review Details</h5>
                                <button
                                    aria-label="Close"
                                    className="btn-close"
                                    onClick={() => setSelectedReview(null)}
                                    type="button"
                                />
                            </div>
                            <div className="modal-body">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="fs-14 text-muted">
                                            Reviewed By
                                        </label>
                                        <div className="fw-medium">
                                            {userName(selectedReview.user)}
                                        </div>
                                        <div className="text-muted">
                                            {selectedReview.user?.email ||
                                                'No email available'}
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-md-0 mt-3">
                                        <label className="fs-14 text-muted">
                                            Reviewed At
                                        </label>
                                        <div className="fw-medium">
                                            {formatDate(
                                                selectedReview.created_at,
                                                true,
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="fs-14 text-muted">
                                        Rating
                                    </label>
                                    <div>
                                        <span className="fs-24 text-warning">
                                            {stars(selectedReview.rating)}
                                        </span>
                                        <span className="fw-medium ms-2">
                                            {Number(
                                                selectedReview.rating,
                                            ).toFixed(1)}{' '}
                                            / 5
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="fs-14 text-muted">
                                        Review Comment
                                    </label>
                                    <div
                                        className="bg-light rounded p-3"
                                        style={{
                                            minHeight: '100px',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {selectedReview.review ||
                                            'No written comment was provided.'}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedReview(null)}
                                    type="button"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
