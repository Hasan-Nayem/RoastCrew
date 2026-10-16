import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface TrackImage {
    id: number;
    image: string;
    url?: string | null;
}

interface Track {
    id: number;
    title: string;
    address?: string | null;
    description?: string | null;
    images?: TrackImage[];
    distance: number | string;
    duration: number | string;
    pace: number | string;
    elevation: number | string;
    start_latitude: number | string;
    start_longitude: number | string;
    end_latitude: number | string;
    end_longitude: number | string;
    status: boolean;
    is_featured: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface TracksPagination {
    data: Track[];
    links: PaginationLink[];
    total: number;
    from: number;
    to: number;
}

interface Props {
    tracks: TracksPagination;
    filters: {
        search?: string;
    };
}

export default function Index({ tracks, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const trackImageUrl = (track: Track) => {
        const image = track.images?.[0];

        if (image?.url) {
            return image.url;
        }

        return image?.image
            ? `/storage/${image.image}`
            : '/backend/assets/images/placholder.png';
    };

    const resetFilters = () => {
        setSearch('');
        router.get('/admin/track');
    };

    const deleteTrack = (id: number) => {
        Swal.fire({
            title: 'Delete Track?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/track/delete/${id}`, {
                    preserveScroll: true,
                });
            }
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/admin/track',
                { search },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="Track List" />

            <div
                className="main-content-container overflow-hidden"
                style={{ minHeight: '75vh' }}
            >
                <div className="row">
                    <div className="col-md-12">
                        <div className="card rounded-10 mb-4 border border-white bg-white">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link
                                    className="fs-16 border-0 bg-transparent p-0 text-primary"
                                    href="/admin/track/create"
                                >
                                    + Add New Track
                                </Link>

                                {/* Filters */}
                                <div className="d-flex align-items-center flex-wrap gap-2">
                                    <input
                                        className="form-control"
                                        placeholder="Search by title"
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        style={{ width: '250px' }}
                                    />

                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="default-table-area mx-minus-1 table-to-do-list">
                                <div className="table-responsive">
                                    <table className="table w-100 align-middle">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Address</th>
                                                <th>Distance (km)</th>
                                                <th>Duration</th>
                                                <th>Pace</th>
                                                <th>Elevation (m)</th>
                                                <th>Status</th>
                                                <th>Featured</th>
                                                <th className="text-end">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {tracks.data.length > 0 ? (
                                                tracks.data.map(
                                                    (track, index) => (
                                                        <tr key={track.id}>
                                                            <td>{index + 1}</td>

                                                            <td>
                                                                <img
                                                                    src={trackImageUrl(
                                                                        track,
                                                                    )}
                                                                    alt={
                                                                        track.title
                                                                    }
                                                                    className="rounded-2"
                                                                    style={{
                                                                        width: '42px',
                                                                        height: '42px',
                                                                        objectFit:
                                                                            'cover',
                                                                    }}
                                                                />
                                                            </td>

                                                            <td>
                                                                <h4 className="fw-medium fs-16 mb-0">
                                                                    {
                                                                        track.title
                                                                    }
                                                                </h4>
                                                            </td>

                                                            <td
                                                                className="text-wrap"
                                                                style={{
                                                                    maxWidth:
                                                                        '180px',
                                                                }}
                                                            >
                                                                {track.address ||
                                                                    '—'}
                                                            </td>

                                                            <td>
                                                                {track.distance}
                                                            </td>

                                                            <td>
                                                                {track.duration}
                                                            </td>

                                                            <td>
                                                                {track.pace}
                                                            </td>

                                                            <td>
                                                                {
                                                                    track.elevation
                                                                }
                                                            </td>

                                                            <td>
                                                                {track.status ? (
                                                                    <span className="badge bg-success bg-opacity-10 text-success">
                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-danger bg-opacity-10 text-danger">
                                                                        Inactive
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td>
                                                                {track.is_featured ? (
                                                                    <span className="badge bg-warning bg-opacity-10 text-warning">
                                                                        Featured
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-opacity-10 bg-secondary text-secondary">
                                                                        Standard
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td>
                                                                <div
                                                                    className="d-flex justify-content-end"
                                                                    style={{
                                                                        gap: '12px',
                                                                    }}
                                                                >
                                                                    <Link
                                                                        className="hover-text-success border-0 bg-transparent p-0"
                                                                        href={`/admin/track/show/${track.id}`}
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                            visibility
                                                                        </i>
                                                                    </Link>

                                                                    <Link
                                                                        className="hover-text-primary border-0 bg-transparent p-0"
                                                                        href={`/admin/track/edit/${track.id}`}
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                            edit
                                                                        </i>
                                                                    </Link>

                                                                    <button
                                                                        onClick={() =>
                                                                            deleteTrack(
                                                                                track.id,
                                                                            )
                                                                        }
                                                                        className="hover-text-danger border-0 bg-transparent p-0"
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                            delete
                                                                        </i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={11}
                                                        className="py-5 text-center"
                                                    >
                                                        No tracks found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20 pt-20">
                                    <span className="fs-14 text-muted">
                                        {tracks.total > 0
                                            ? `Showing ${tracks.from}–${tracks.to} of ${tracks.total} tracks`
                                            : 'No tracks'}
                                    </span>

                                    <ul className="pagination mb-0">
                                        {tracks.links.map((link, index) => (
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
                                                            router.visit(
                                                                link.url,
                                                                {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                },
                                                            );
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
            </div>
        </>
    );
}
