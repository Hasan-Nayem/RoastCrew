import { Head, Link, router } from '@inertiajs/react';
import DashboardChart from '../../widget/chart';

interface DashboardProps {
    totals: { posts: number; reels: number; products: number };
    weeklyTrends: { posts: number; reels: number; products: number };
    userGrowth: { year: number; data: number[] };
    contentVolume: { years: number[]; posts: number[]; reels: number[] };
    interactions: { posts: number[]; reels: number[]; trend: number };
    topLikedPosts: PaginatedData<LikedPost>;
    topLikedReels: PaginatedData<LikedReel>;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
}

interface Publisher {
    first_name: string | null;
    last_name: string | null;
    user_name: string | null;
}

interface LikedPost {
    id: number;
    title: string;
    reactions_count: number;
    latest_image: { url: string | null } | null;
    user: Publisher | null;
}

interface LikedReel {
    id: number;
    caption: string | null;
    thumbnail_url: string | null;
    reel_likes_count: number;
    user: Publisher | null;
}

const formatNumber = (value: number) => value.toLocaleString();

const truncateText = (value: string, limit = 20) => {
    const characters = Array.from(value.trim());

    return characters.length > limit
        ? `${characters.slice(0, limit).join('')}...`
        : value;
};

const publisherName = (publisher: Publisher | null) => {
    if (!publisher) {
        return 'Unknown publisher';
    }

    return (
        [publisher.first_name, publisher.last_name].filter(Boolean).join(' ') ||
        publisher.user_name ||
        'Unknown publisher'
    );
};

function TablePagination({ data }: { data: PaginatedData<unknown> }) {
    const previous = data.links[0];
    const next = data.links[data.links.length - 1];
    const pages = data.links.slice(1, -1);
    const visit = (url: string | null) => {
        if (!url) {
            return;
        }

        router.visit(url, { preserveScroll: true, preserveState: true });
    };

    return (
        <div
            className="d-flex justify-content-center justify-content-sm-between align-items-center showing-wrap flex-wrap gap-2 pt-15 text-center"
            data-pagination-component
        >
            <span className="fs-15">
                Showing {data.from ?? 0} to {data.to ?? 0} of {data.total}{' '}
                entries
            </span>
            <nav aria-label="Table pagination" className="custom-pagination">
                <ul className="pagination justify-content-center mb-0">
                    <li
                        className={`page-item ${!previous?.url ? 'disabled' : ''}`}
                    >
                        <button
                            aria-label="Previous"
                            className="page-link icon"
                            disabled={!previous?.url}
                            onClick={() => visit(previous?.url ?? null)}
                        >
                            <i className="material-symbols-outlined">west</i>
                        </button>
                    </li>
                    {pages.map((page, index) => (
                        <li
                            className={`page-item ${!page.url ? 'disabled' : ''}`}
                            key={`${page.label}-${index}`}
                        >
                            <button
                                className={`page-link ${page.active ? 'active' : ''}`}
                                disabled={!page.url}
                                onClick={() => visit(page.url)}
                            >
                                {page.label
                                    .replaceAll('&laquo;', '')
                                    .replaceAll('&raquo;', '')}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${!next?.url ? 'disabled' : ''}`}>
                        <button
                            aria-label="Next"
                            className="page-link icon"
                            disabled={!next?.url}
                            onClick={() => visit(next?.url ?? null)}
                        >
                            <i className="material-symbols-outlined">east</i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

function Trend({
    value,
    label,
    showLabel = true,
}: {
    value: number;
    label: string;
    showLabel?: boolean;
}) {
    const increasing = value >= 0;
    const color = increasing ? 'success' : 'danger';

    return (
        <>
            {showLabel && (
                <p className="fs-14 mb-0">
                    {Math.abs(value).toFixed(2)}%{' '}
                    {increasing ? 'increase' : 'decrease'} {label}
                </p>
            )}
            <span
                className={`d-flex align-content-center bg-${color} bg-opacity-10 border-${color} gap-1 border`}
                style={{ padding: '3px 5px' }}
            >
                <i className={`material-symbols-outlined fs-14 text-${color}`}>
                    {increasing ? 'trending_up' : 'trending_down'}
                </i>
                <span className={`lh-1 fs-14 text-${color}`}>
                    {Math.abs(value).toFixed(2)}%
                </span>
            </span>
        </>
    );
}

export default function Dashboard({
    totals,
    weeklyTrends,
    userGrowth,
    contentVolume,
    interactions,
    topLikedPosts,
    topLikedReels,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="main-content-container overflow-hidden">
                <div className="row">
                    <div className="col-md-12 col-lg-4">
                        <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <h3 className="mb-10">
                                        Total Posts Shared
                                    </h3>
                                    <h2 className="fs-26 fw-medium lh-1 mb-0">
                                        {formatNumber(totals.posts)}
                                    </h2>
                                </div>
                                <div className="ms-3 flex-shrink-0">
                                    <div
                                        className="rounded-circle d-block bg-primary text-center text-white"
                                        style={{
                                            width: '75px',
                                            height: '75px',
                                            lineHeight: '105px',
                                        }}
                                    >
                                        <i className="material-symbols-outlined fs-40">
                                            post
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ marginTop: '21px' }}
                            >
                                <Trend
                                    value={weeklyTrends.posts}
                                    label="from the previous week"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-4">
                        <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <h3 className="mb-10">
                                        Total Reels Shared
                                    </h3>
                                    <h2 className="fs-26 fw-medium lh-1 mb-0">
                                        {formatNumber(totals.reels)}
                                    </h2>
                                </div>
                                <div className="ms-3 flex-shrink-0">
                                    <div
                                        className="bg-info rounded-circle d-block text-center text-white"
                                        style={{
                                            width: '75px',
                                            height: '75px',
                                            lineHeight: '105px',
                                        }}
                                    >
                                        <i className="material-symbols-outlined fs-40">
                                            video_library
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ marginTop: '21px' }}
                            >
                                <Trend
                                    value={weeklyTrends.reels}
                                    label="from the previous week"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-4">
                        <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <h3 className="mb-10">
                                        Total Product Posted
                                    </h3>
                                    <h2 className="fs-26 fw-medium lh-1 mb-0">
                                        {formatNumber(totals.products)}
                                    </h2>
                                </div>
                                <div className="ms-3 flex-shrink-0">
                                    <div
                                        className="rounded-circle d-block bg-secondary text-center text-white"
                                        style={{
                                            width: '75px',
                                            height: '75px',
                                            lineHeight: '105px',
                                        }}
                                    >
                                        <i className="material-symbols-outlined fs-40">
                                            shopping_cart
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ marginTop: '21px' }}
                            >
                                <Trend
                                    value={weeklyTrends.products}
                                    label="from the previous week"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-xxl-12 col-xxxl-12">
                        <div className="row">
                            <div className="col-lg-12 col-md-6">
                                <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                        <h3>User Growth</h3>
                                        <div className="dropdown select-dropdown without-border">
                                            <button
                                                aria-expanded="false"
                                                className="dropdown-toggle fs-15 bg-transparent text-secondary"
                                                data-bs-toggle="dropdown"
                                            >
                                                Year {userGrowth.year}
                                            </button>
                                            <ul
                                                className="dropdown-menu dropdown-menu-end box-shadow rounded-10 border-0 bg-white"
                                                data-simplebar=""
                                            >
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        Year 2025
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        Year 2025
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        Year 2023
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    {/* Area Chart */}
                                    <DashboardChart
                                        type="area"
                                        height="260"
                                        categories={[
                                            'Jan',
                                            'Feb',
                                            'Mar',
                                            'Apr',
                                            'May',
                                            'Jun',
                                            'Jul',
                                            'Aug',
                                            'Sep',
                                            'Oct',
                                            'Nov',
                                            'Dec',
                                        ]}
                                        series={[
                                            {
                                                name: 'Users',
                                                data: userGrowth.data,
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xxl-12 col-xxxl-12">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                                    <div className="d-flex justify-content-between align-items-center mb-20 flex-wrap gap-3">
                                        <h3>Content Volume</h3>
                                        <div className="dropdown select-dropdown without-border">
                                            <button
                                                aria-expanded="false"
                                                className="dropdown-toggle fs-15 bg-transparent text-secondary"
                                                data-bs-toggle="dropdown"
                                            >
                                                Action
                                            </button>
                                            <ul
                                                className="dropdown-menu dropdown-menu-end box-shadow rounded-10 border-0 bg-white"
                                                data-simplebar=""
                                            >
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        Export
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        Print
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <DashboardChart
                                        type="bar"
                                        height="225"
                                        categories={contentVolume.years.map(
                                            String,
                                        )}
                                        series={[
                                            {
                                                name: 'Reels',
                                                data: contentVolume.reels,
                                            },
                                            {
                                                name: 'Post',
                                                data: contentVolume.posts,
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                                    <div className="d-flex justify-content-between align-items-center mb-20 flex-wrap gap-3">
                                        <h3>Interaction Rate</h3>
                                        <Trend
                                            value={interactions.trend}
                                            label="from last month"
                                            showLabel={false}
                                        />
                                    </div>

                                    <DashboardChart
                                        type="line"
                                        height="225"
                                        categories={[
                                            'Jan',
                                            'Feb',
                                            'Mar',
                                            'Apr',
                                            'May',
                                            'Jun',
                                            'Jul',
                                            'Aug',
                                            'Sep',
                                            'Oct',
                                            'Nov',
                                            'Dec',
                                        ]}
                                        series={[
                                            {
                                                name: 'Reels',
                                                data: interactions.reels,
                                            },
                                            {
                                                name: 'Posts',
                                                data: interactions.posts,
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xxl-6 col-xxxl-6 col-md-12">
                        <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                            <div className="d-flex justify-content-between align-items-center mb-20 flex-wrap gap-3">
                                <h3>Top Liked Posts</h3>
                                <div className="dropdown select-dropdown without-border">
                                    <button
                                        aria-expanded="false"
                                        className="dropdown-toggle fs-15 bg-transparent text-secondary"
                                        data-bs-toggle="dropdown"
                                    >
                                        This Week
                                    </button>
                                    <ul
                                        className="dropdown-menu dropdown-menu-end box-shadow rounded-10 border-0 bg-white"
                                        data-simplebar=""
                                    >
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Day
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Week
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Month
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Year
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="default-table-area without-header table-top-selling-products">
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <tbody className="d-none">
                                            {topLikedReels.data.length ? (
                                                topLikedReels.data.map(
                                                    (reel, index) => (
                                                        <tr key={reel.id}>
                                                            <td className="text-body fw-medium">
                                                                {' '}
                                                                {String(
                                                                    (topLikedReels.from ??
                                                                        1) +
                                                                        index,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                                .
                                                            </td>
                                                            <td className="ps-0">
                                                                <div className="d-flex align-items-center">
                                                                    {reel.thumbnail_url ? (
                                                                        <img
                                                                            alt={
                                                                                reel.caption ??
                                                                                `Reel ${reel.id}`
                                                                            }
                                                                            className="rounded-circle flex-shrink-0"
                                                                            src={
                                                                                reel.thumbnail_url
                                                                            }
                                                                            style={{
                                                                                width: '50px',
                                                                                height: '50px',
                                                                                objectFit:
                                                                                    'cover',
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <span
                                                                            className="rounded-circle d-flex align-items-center justify-content-center bg-light flex-shrink-0 text-secondary"
                                                                            style={{
                                                                                width: '50px',
                                                                                height: '50px',
                                                                            }}
                                                                        >
                                                                            <i className="material-symbols-outlined">
                                                                                video_library
                                                                            </i>
                                                                        </span>
                                                                    )}
                                                                    <div className="ms-12 flex-grow-1">
                                                                        <h3 className="fw-normal">
                                                                            {reel.caption
                                                                                ? truncateText(
                                                                                      reel.caption,
                                                                                  )
                                                                                : `Reel #${reel.id}`}
                                                                        </h3>
                                                                        <span className="fs-14 text-body fw-normal">
                                                                            {' '}
                                                                            {publisherName(
                                                                                reel.user,
                                                                            )}{' '}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-body">
                                                                Reel #{reel.id}
                                                            </td>
                                                            <td className="text-body">
                                                                {' '}
                                                                {formatNumber(
                                                                    reel.reel_likes_count,
                                                                )}{' '}
                                                                Likes{' '}
                                                            </td>{' '}
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="text-body py-4 text-center"
                                                        colSpan={4}
                                                    >
                                                        No reels available yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tbody data-dashboard-table="posts">
                                            {topLikedPosts.data.length ? (
                                                topLikedPosts.data.map(
                                                    (post, index) => (
                                                        <tr key={post.id}>
                                                            <td className="text-body fw-medium">
                                                                {String(
                                                                    (topLikedPosts.from ??
                                                                        1) +
                                                                        index,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                                .
                                                            </td>
                                                            <td className="ps-0">
                                                                <Link
                                                                    className="d-flex align-items-center text-decoration-none"
                                                                    href={`/admin/posts/show/${post.id}`}
                                                                >
                                                                    {post
                                                                        .latest_image
                                                                        ?.url ? (
                                                                        <img
                                                                            alt={
                                                                                post.title
                                                                            }
                                                                            className="rounded-circle flex-shrink-0"
                                                                            src={
                                                                                post
                                                                                    .latest_image
                                                                                    .url
                                                                            }
                                                                            style={{
                                                                                width: '50px',
                                                                                height: '50px',
                                                                                objectFit:
                                                                                    'cover',
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <span
                                                                            className="rounded-circle d-flex align-items-center justify-content-center bg-light flex-shrink-0 text-secondary"
                                                                            style={{
                                                                                width: '50px',
                                                                                height: '50px',
                                                                            }}
                                                                        >
                                                                            <i className="material-symbols-outlined">
                                                                                post
                                                                            </i>
                                                                        </span>
                                                                    )}
                                                                    <div className="ms-12 flex-grow-1">
                                                                        <h3 className="fw-normal hover-text">
                                                                            {truncateText(
                                                                                post.title,
                                                                            )}
                                                                        </h3>
                                                                        <span className="fs-14 text-body fw-normal">
                                                                            {publisherName(
                                                                                post.user,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td className="text-body">
                                                                Post #{post.id}
                                                            </td>
                                                            <td className="text-body">
                                                                {formatNumber(
                                                                    post.reactions_count,
                                                                )}{' '}
                                                                Likes
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="text-body py-4 text-center"
                                                        colSpan={4}
                                                    >
                                                        No posts available yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tbody className="d-none">
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    01.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product1"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product1.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Smart Watch
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                953 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-1217
                                                </td>
                                                <td className="text-body">
                                                    $90,954
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    02.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product2"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product2.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Mobile Phone
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                876 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-9513
                                                </td>
                                                <td className="text-body">
                                                    $85,648
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    03.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product3"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product3.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Laptop Device
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                823 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-7531
                                                </td>
                                                <td className="text-body">
                                                    $79,852
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    04.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product4"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product4.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Black T-Shirt
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                743 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-3579
                                                </td>
                                                <td className="text-body">
                                                    $73,624
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    05.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product5"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product5.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Headphones
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                693 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-4826
                                                </td>
                                                <td className="text-body">
                                                    $65,973
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    06.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product6"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product6.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Hand Watch
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                654 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-1265
                                                </td>
                                                <td className="text-body">
                                                    $42,455
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <TablePagination data={topLikedPosts} />
                                <div
                                    className="d-none"
                                    data-dashboard-placeholder="pagination"
                                >
                                    <span className="fs-15">
                                        Showing 1 to 5 of 50 entries
                                    </span>
                                    <nav
                                        aria-label="Page navigation example"
                                        className="custom-pagination"
                                    >
                                        <ul className="pagination justify-content-center mb-0">
                                            <li className="page-item">
                                                <button
                                                    aria-label="Previous"
                                                    className="page-link icon"
                                                >
                                                    <i className="material-symbols-outlined">
                                                        west
                                                    </i>
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link active">
                                                    1
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    2
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    3
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button
                                                    aria-label="Next"
                                                    className="page-link icon"
                                                >
                                                    <i className="material-symbols-outlined">
                                                        east
                                                    </i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xxxl-6 col-md-12">
                        <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                            <div className="d-flex justify-content-between align-items-center mb-20 flex-wrap gap-3">
                                <h3>Top Liked Reels</h3>
                                <div className="dropdown select-dropdown without-border">
                                    <button
                                        aria-expanded="false"
                                        className="dropdown-toggle fs-15 bg-transparent text-secondary"
                                        data-bs-toggle="dropdown"
                                    >
                                        This Week
                                    </button>
                                    <ul
                                        className="dropdown-menu dropdown-menu-end box-shadow rounded-10 border-0 bg-white"
                                        data-simplebar=""
                                    >
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Day
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Week
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Month
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Year
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="default-table-area without-header table-top-selling-products">
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <tbody>
                                            {topLikedReels.data.length ? (
                                                topLikedReels.data.map(
                                                    (reel, index) => (
                                                        <tr key={reel.id}>
                                                            <td className="text-body fw-medium">
                                                                {String(
                                                                    (topLikedReels.from ??
                                                                        1) +
                                                                        index,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}{' '}
                                                                .
                                                            </td>
                                                            <td className="ps-0">
                                                                <div className="d-flex align-items-center">
                                                                    {reel.thumbnail_url ? (
                                                                        <img
                                                                            alt={
                                                                                reel.caption ??
                                                                                `Reel ${reel.id}`
                                                                            }
                                                                            className="rounded-circle flex-shrink-0"
                                                                            src={
                                                                                reel.thumbnail_url
                                                                            }
                                                                            style={{
                                                                                width: '50px',
                                                                                height: '50px',
                                                                                objectFit:
                                                                                    'cover',
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <span
                                                                            className="rounded-circle d-flex align-items-center justify-content-center bg-light flex-shrink-0 text-secondary"
                                                                            style={{
                                                                                width: '50px',
                                                                                height: '50px',
                                                                            }}
                                                                        >
                                                                            <i className="material-symbols-outlined">
                                                                                video_library
                                                                            </i>
                                                                        </span>
                                                                    )}
                                                                    <div className="ms-12 flex-grow-1">
                                                                        <h3 className="fw-normal">
                                                                            {reel.caption
                                                                                ? truncateText(
                                                                                      reel.caption,
                                                                                  )
                                                                                : `Reel #${reel.id}`}
                                                                        </h3>
                                                                        <span className="fs-14 text-body fw-normal">
                                                                            {publisherName(
                                                                                reel.user,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-body">
                                                                Reel #{reel.id}
                                                            </td>
                                                            <td className="text-body">
                                                                {formatNumber(
                                                                    reel.reel_likes_count,
                                                                )}{' '}
                                                                Likes
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="text-body py-4 text-center"
                                                        colSpan={4}
                                                    >
                                                        No reels available yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tbody className="d-none">
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    01.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product1"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product1.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Smart Watch
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                953 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-1217
                                                </td>
                                                <td className="text-body">
                                                    $90,954
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    02.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product2"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product2.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Mobile Phone
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                876 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-9513
                                                </td>
                                                <td className="text-body">
                                                    $85,648
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    03.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product3"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product3.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Laptop Device
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                823 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-7531
                                                </td>
                                                <td className="text-body">
                                                    $79,852
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    04.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product4"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product4.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Black T-Shirt
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                743 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-3579
                                                </td>
                                                <td className="text-body">
                                                    $73,624
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    05.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product5"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product5.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Headphones
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                693 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-4826
                                                </td>
                                                <td className="text-body">
                                                    $65,973
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    06.
                                                </td>
                                                <td className="ps-0">
                                                    <a
                                                        className="d-flex align-items-center text-decoration-none"
                                                        href="product-details.html"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                alt="product6"
                                                                className="rounded-circle"
                                                                src="/backend/assets/images/product6.png"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ms-12 flex-grow-1">
                                                            <h3 className="fw-normal hover-text">
                                                                Hand Watch
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                654 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-1265
                                                </td>
                                                <td className="text-body">
                                                    $42,455
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <TablePagination data={topLikedReels} />
                                <div className="d-none">
                                    <span className="fs-15">
                                        Showing 1 to 5 of 50 entries
                                    </span>
                                    <nav
                                        aria-label="Page navigation example"
                                        className="custom-pagination"
                                    >
                                        <ul className="pagination justify-content-center mb-0">
                                            <li className="page-item">
                                                <button
                                                    aria-label="Previous"
                                                    className="page-link icon"
                                                >
                                                    <i className="material-symbols-outlined">
                                                        west
                                                    </i>
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link active">
                                                    1
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    2
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    3
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button
                                                    aria-label="Next"
                                                    className="page-link icon"
                                                >
                                                    <i className="material-symbols-outlined">
                                                        east
                                                    </i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
