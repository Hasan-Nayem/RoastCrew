import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

export default function Create() {
    const { data, setData, processing, post, errors } = useForm({
        title: "",
        description: "",
        distance: "",
        duration: "",
        pace: "",
        elevation: "",
        start_latitude: "",
        start_longitude: "",
        end_latitude: "",
        end_longitude: "",
        status: "1",
        is_featured: "0",
        images: [] as File[],
    });

    const previews = useMemo(
        () => data.images.map((image) => URL.createObjectURL(image)),
        [data.images],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/track', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Create Track" />

            <div className="row">
                {/* Main Form */}
                <div className="col-lg-8">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <h3 className="mb-20">Add Track</h3>

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
                                                placeholder="e.g. 2"
                                                value={data.duration}
                                                onChange={(e) =>
                                                    setData(
                                                        'duration',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <label>Duration</label>
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

                                {/* =========================================================================
                                =========================================================================
                                =========================================================================
                                ========================================================================= */}

                                {/* Start Coordinates */}
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Start location <span className="text-danger">*</span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                step="0.00000001"
                                                className={`form-control ${errors.start_location ? "is-invalid" : ""}`}
                                                placeholder="0.00000000"
                                                value={data.start_location}
                                                onChange={(e) => setData("start_location", e.target.value)}
                                            />
                                            <label>Start location</label>
                                        </div>
                                        {errors.start_location && (
                                            <div className="text-danger mt-1">{errors.start_location}</div>
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


                                {/* =========================================================================
                                =========================================================================
                                =========================================================================
                                ========================================================================= */}

                                {/* End Location */}
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            End Location <span className="text-danger">*</span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                step="0.00000001"
                                                className={`form-control ${errors.end_location ? "is-invalid" : ""}`}
                                                placeholder="0.00000000"
                                                value={data.end_location}
                                                onChange={(e) => setData("end_location", e.target.value)}
                                            />
                                            <label>End Latitude</label>
                                        </div>
                                        {errors.end_location && (
                                            <div className="text-danger mt-1">{errors.end_location}</div>
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
                                            Track Images
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
                                                    <i className="ri-folder-image-line bg-primary bg-opacity-10 p-2 rounded-1 text-primary">
                                                    </i>
                                                    <span className="d-block text-body fs-14 mt-4">
                                                        Drag and drop an image or
                                                        <span className="text-primary text-decoration-underline">
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
                                                : 'Add Track'}
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

                    {/* Tips */}
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <h3 className="mb-20">Tips</h3>
                        <ul className="fs-14 mb-0 ps-3 text-muted">
                            <li className="mb-2">
                                Use a descriptive title for easy identification.
                            </li>
                            <li className="mb-2">
                                Coordinates should be in decimal degrees format.
                            </li>
                            <li className="mb-2">
                                Distance is measured in kilometers.
                            </li>
                            <li>Recommended image size: 400×400 px.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
