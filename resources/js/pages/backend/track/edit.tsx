import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

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
}

interface Props {
    track: Track;
}

const imageUrl = (image: TrackImage) => {
    if (image.url) {
        return image.url;
    }

    return image.image
        ? `/storage/${image.image}`
        : '/backend/assets/images/placholder.png';
};

export default function Edit({ track }: Props) {
    const { data, setData, processing, post, errors } = useForm({
        title: track.title || '',
        description: track.description || '',
        address: track.address || '',
        distance: track.distance?.toString() || '',
        duration: track.duration?.toString() || '',
        pace: track.pace?.toString() || '',
        elevation: track.elevation?.toString() || '',
        start_latitude: track.start_latitude?.toString() || '',
        start_longitude: track.start_longitude?.toString() || '',
        end_latitude: track.end_latitude?.toString() || '',
        end_longitude: track.end_longitude?.toString() || '',
        status: track.status ? '1' : '0',
        is_featured: track.is_featured ? '1' : '0',
        images: [] as File[],
        _method: 'put',
    });

    const previews = useMemo(
        () => data.images.map((image) => URL.createObjectURL(image)),
        [data.images],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/admin/track/${track.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Track" />

            <div className="row">
                {/* Main Form */}
                <div className="col-lg-8">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <h3 className="mb-20">Edit Track</h3>

                        <form onSubmit={submit}>
                            {Object.keys(errors).length > 0 && (
                                <div className="alert alert-danger mb-20">
                                    <ul className="mb-0 ps-3">
                                        {Object.values(errors).map(
                                            (error, index) => (
                                                <li key={index}>{error}</li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div className="row">
                                {/* Title */}
                                <div className="col-lg-12">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Title{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                placeholder="Track title"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Track title</label>
                                        </div>
                                        {errors.title && (
                                            <div className="text-danger mt-1">
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-lg-12">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            placeholder="Enter track description..."
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.description && (
                                            <div className="text-danger mt-1">
                                                {errors.description}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="col-lg-12">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Address
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                placeholder="Track address"
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData(
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Address</label>
                                        </div>
                                        {errors.address && (
                                            <div className="text-danger mt-1">
                                                {errors.address}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Distance & Duration */}
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Distance (km){' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className={`form-control ${errors.distance ? 'is-invalid' : ''}`}
                                                placeholder="0.00"
                                                value={data.distance}
                                                onChange={(e) =>
                                                    setData(
                                                        'distance',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Distance (km)</label>
                                        </div>
                                        {errors.distance && (
                                            <div className="text-danger mt-1">
                                                {errors.distance}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Duration{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                                                placeholder="e.g. 1:30:00"
                                                value={data.duration}
                                                onChange={(e) =>
                                                    setData(
                                                        'duration',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Duration (HH:MM:SS)</label>
                                        </div>
                                        {errors.duration && (
                                            <div className="text-danger mt-1">
                                                {errors.duration}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Pace & Elevation */}
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Pace{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.pace ? 'is-invalid' : ''}`}
                                                placeholder="e.g. 5:30 /km"
                                                value={data.pace}
                                                onChange={(e) =>
                                                    setData(
                                                        'pace',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Pace (min/km)</label>
                                        </div>
                                        {errors.pace && (
                                            <div className="text-danger mt-1">
                                                {errors.pace}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Elevation (m){' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className={`form-control ${errors.elevation ? 'is-invalid' : ''}`}
                                                placeholder="0.00"
                                                value={data.elevation}
                                                onChange={(e) =>
                                                    setData(
                                                        'elevation',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Elevation (m)</label>
                                        </div>
                                        {errors.elevation && (
                                            <div className="text-danger mt-1">
                                                {errors.elevation}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Start Coordinates */}
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Start Latitude{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                step="0.00000001"
                                                className={`form-control ${errors.start_latitude ? 'is-invalid' : ''}`}
                                                placeholder="0.00000000"
                                                value={data.start_latitude}
                                                onChange={(e) =>
                                                    setData(
                                                        'start_latitude',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Start Latitude</label>
                                        </div>
                                        {errors.start_latitude && (
                                            <div className="text-danger mt-1">
                                                {errors.start_latitude}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Start Longitude{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                step="0.00000001"
                                                className={`form-control ${errors.start_longitude ? 'is-invalid' : ''}`}
                                                placeholder="0.00000000"
                                                value={data.start_longitude}
                                                onChange={(e) =>
                                                    setData(
                                                        'start_longitude',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Start Longitude</label>
                                        </div>
                                        {errors.start_longitude && (
                                            <div className="text-danger mt-1">
                                                {errors.start_longitude}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* End Coordinates */}
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            End Latitude{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                step="0.00000001"
                                                className={`form-control ${errors.end_latitude ? 'is-invalid' : ''}`}
                                                placeholder="0.00000000"
                                                value={data.end_latitude}
                                                onChange={(e) =>
                                                    setData(
                                                        'end_latitude',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>End Latitude</label>
                                        </div>
                                        {errors.end_latitude && (
                                            <div className="text-danger mt-1">
                                                {errors.end_latitude}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            End Longitude{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                step="0.00000001"
                                                className={`form-control ${errors.end_longitude ? 'is-invalid' : ''}`}
                                                placeholder="0.00000000"
                                                value={data.end_longitude}
                                                onChange={(e) =>
                                                    setData(
                                                        'end_longitude',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>End Longitude</label>
                                        </div>
                                        {errors.end_longitude && (
                                            <div className="text-danger mt-1">
                                                {errors.end_longitude}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="form-group only-file-upload mb-4">
                                        <label className="label fs-16">
                                            Replace Images
                                        </label>
                                        <div
                                            className="form-control position-relative p-lg-5 h-100 p-4 text-center"
                                            style={{ minHeight: '180px' }}
                                        >
                                            {previews.length > 0 ? (
                                                <div className="d-flex justify-content-center flex-wrap gap-2">
                                                    {previews.map((preview) => (
                                                        <img
                                                            alt="Track preview"
                                                            key={preview}
                                                            src={preview}
                                                            style={{
                                                                height: '72px',
                                                                objectFit:
                                                                    'cover',
                                                                width: '72px',
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <label className="file-upload mb-0">
                                                    <i className="ri-folder-image-line bg-opacity-10 rounded-1 bg-primary p-2 text-primary"></i>
                                                    <span className="d-block text-body fs-14">
                                                        Drag and drop new images
                                                        or
                                                        <span className="text-decoration-underline text-primary">
                                                            Browse
                                                        </span>
                                                    </span>
                                                </label>
                                            )}

                                            <label className="position-absolute cursor active start-0 end-0 top-0 bottom-0">
                                                <input
                                                    accept="image/*"
                                                    className="form__file bottom-0"
                                                    multiple
                                                    onChange={(e) =>
                                                        setData(
                                                            'images',
                                                            Array.from(
                                                                e.target
                                                                    .files ??
                                                                    [],
                                                            ),
                                                        )
                                                    }
                                                    type="file"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {errors.images && (
                                        <div className="text-danger mt-1">
                                            {errors.images}
                                        </div>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary fw-normal text-white"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Saving...'
                                                : 'Update Track'}
                                        </button>

                                        <Link
                                            href="/admin/track"
                                            className="btn btn-danger fw-normal text-white"
                                        >
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar - Status & Featured */}
                <div className="col-lg-4">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <h3 className="mb-20">Visibility</h3>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Status</label>
                            <div className="form-floating">
                                <select
                                    className="form-select form-control"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                <label>Select status</label>
                            </div>
                            {errors.status && (
                                <div className="text-danger mt-1">
                                    {errors.status}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="label fs-16 mb-2">Featured</label>
                            <div className="form-floating">
                                <select
                                    className="form-select form-control"
                                    value={data.is_featured}
                                    onChange={(e) =>
                                        setData('is_featured', e.target.value)
                                    }
                                >
                                    <option value="0">Standard</option>
                                    <option value="1">Featured</option>
                                </select>
                                <label>Select featured status</label>
                            </div>
                            {errors.is_featured && (
                                <div className="text-danger mt-1">
                                    {errors.is_featured}
                                </div>
                            )}
                        </div>
                    </div>

                    {track.images && track.images.length > 0 && (
                        <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                            <h3 className="mb-20">Current Images</h3>
                            <div className="d-flex flex-wrap gap-2">
                                {track.images.map((image) => (
                                    <img
                                        key={image.id}
                                        src={imageUrl(image)}
                                        alt={track.title}
                                        className="rounded-2"
                                        style={{
                                            width: '72px',
                                            height: '72px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
