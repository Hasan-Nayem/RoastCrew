import { Head, Link } from '@inertiajs/react';

interface TrackImage {
    id: number;
    image: string;
    url?: string | null;
}

interface Track {
    id: number;
    title: string;
    address?: string | null;
    description: string;
    images?: TrackImage[];
    distance: number | string;
    duration: string;
    pace: string;
    elevation: number | string;
    start_latitude: number | string;
    start_longitude: number | string;
    end_latitude: number | string;
    end_longitude: number | string;
    status: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    track: Track;
}

export default function Show({ track }: Props) {
    const primaryImage = track.images?.[0];
    const image =
        primaryImage?.url ||
        (primaryImage?.image
            ? `/storage/${primaryImage.image}`
            : '/backend/assets/images/placholder.png');

    return (
        <>
            <Head title={`Track - ${track.title}`} />

            <div className="row">
                {/* Image Card */}
                <div className="col-lg-4">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <div
                            className="text-center"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <img
                                src={image}
                                alt={track.title}
                                className="rounded-2 mb-3 border border-1"
                                style={{
                                    width: '160px',
                                    height: '160px',
                                    objectFit: 'cover',
                                }}
                            />

                            {track.images && track.images.length > 1 && (
                                <div className="d-flex justify-content-center mb-3 flex-wrap gap-2">
                                    {track.images.slice(1).map((trackImage) => (
                                        <img
                                            key={trackImage.id}
                                            src={
                                                trackImage.url ||
                                                `/storage/${trackImage.image}`
                                            }
                                            alt={track.title}
                                            className="rounded-2 border border-1"
                                            style={{
                                                width: '54px',
                                                height: '54px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            <h3 className="mb-1">{track.title}</h3>

                            <div className="d-flex mt-2 gap-2">
                                {track.status ? (
                                    <span className="badge bg-success text-capitalize fs-14">
                                        Active
                                    </span>
                                ) : (
                                    <span className="badge bg-danger text-capitalize fs-14">
                                        Inactive
                                    </span>
                                )}

                                {track.is_featured ? (
                                    <span className="badge bg-warning text-capitalize fs-14">
                                        Featured
                                    </span>
                                ) : (
                                    <span className="badge text-capitalize fs-14 bg-secondary">
                                        Standard
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="col-lg-8">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">Track Information</h3>

                            <div className="d-flex gap-2">
                                <Link
                                    href={`/admin/track/edit/${track.id}`}
                                    className="btn btn-primary text-white"
                                >
                                    Edit
                                </Link>

                                <Link
                                    href="/admin/track"
                                    className="btn btn-secondary"
                                >
                                    Back
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            {/* Title */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Title
                                </label>
                                <div className="form-control bg-light">
                                    {track.title}
                                </div>
                            </div>

                            {/* Distance */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Distance
                                </label>
                                <div className="form-control bg-light">
                                    {track.distance} km
                                </div>
                            </div>

                            {/* Address */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Address
                                </label>
                                <div className="form-control bg-light">
                                    {track.address || 'N/A'}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Duration
                                </label>
                                <div className="form-control bg-light">
                                    {track.duration}
                                </div>
                            </div>

                            {/* Pace */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Pace
                                </label>
                                <div className="form-control bg-light">
                                    {track.pace}
                                </div>
                            </div>

                            {/* Elevation */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Elevation
                                </label>
                                <div className="form-control bg-light">
                                    {track.elevation} m
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Status
                                </label>
                                <div>
                                    {track.status ? (
                                        <span className="badge bg-success bg-opacity-10 text-success">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="badge bg-danger bg-opacity-10 text-danger">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Featured */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Featured
                                </label>
                                <div>
                                    {track.is_featured ? (
                                        <span className="badge bg-warning bg-opacity-10 text-warning">
                                            Featured
                                        </span>
                                    ) : (
                                        <span className="badge bg-opacity-10 bg-secondary text-secondary">
                                            Standard
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Start Coordinates */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Start Coordinates
                                </label>
                                <div className="form-control bg-light">
                                    {track.start_latitude},{' '}
                                    {track.start_longitude}
                                </div>
                            </div>

                            {/* End Coordinates */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    End Coordinates
                                </label>
                                <div className="form-control bg-light">
                                    {track.end_latitude}, {track.end_longitude}
                                </div>
                            </div>

                            {/* Created At */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Created At
                                </label>
                                <div className="form-control bg-light">
                                    {new Date(
                                        track.created_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>

                            {/* Updated At */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 mb-2 text-muted">
                                    Last Updated
                                </label>
                                <div className="form-control bg-light">
                                    {new Date(
                                        track.updated_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            {track.description && (
                                <div className="col-md-12 mb-4">
                                    <label className="label fs-14 mb-2 text-muted">
                                        Description
                                    </label>
                                    <div
                                        className="form-control bg-light"
                                        style={{
                                            minHeight: '80px',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {track.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
