import { Head } from "@inertiajs/react";

interface user {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    avatar?: string;
}

interface Post {
    id: number;
    user_id: number;
    track_id?: number;
    title?: string;
    descriptions?: string;
    address?: string;
    distance?: number;
    duration?: string;
    pace?: string;
    elevation?: number;
    start_location?: string;
    start_latitude?: number;
    start_longitude?: number;
    end_location?: string;
    end_latitude?: number;
    end_longitude?: number;
    is_published: boolean;
    images?: any[];
    audios?: any[];
    videos?: any[];
    comment_count?: number;
    react_count?: number;
    created_at: string;
    user: user;
}

interface Props {
    post: Post;
}

export default function Show({ post }: Props) {
    return (
        <>
            <Head title="Post Details" />

            <div
                className="main-content-container overflow-hidden"
                style={{ minHeight: "75vh" }}
            >
                <div className="row">
                    <div className="col-lg-12">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <button
                                onClick={() => window.history.back()}
                                className="btn btn-secondary text-white"
                            >
                                Back
                            </button>
                        </div>

                        <div className="card border-0 bg-white rounded-10">
                            <div className="card-body p-4">

                                {/* Header */}
                                <div className="mb-4">
                                    <h4 className="mb-2">
                                        Post #{post.id}
                                    </h4>

                                    <p className="text-muted mb-1">
                                        Published by:
                                        <strong className="ms-2">
                                            {post.user?.first_name ? post.user?.first_name + " " + post.user?.last_name : "Unknown"}
                                        </strong>
                                    </p>

                                    <p className="text-muted mb-0">
                                        {post.created_at}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="row mb-4">
                                    <div className="col-md-4">
                                        <div className="border rounded p-3 text-center">
                                            <h5>{post.react_count ?? 0}</h5>
                                            <span>Likes</span>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="border rounded p-3 text-center">
                                            <h5>{post.comment_count ?? 0}</h5>
                                            <span>Comments</span>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="border rounded p-3 text-center">
                                            <h5>{post.is_published ? "Yes" : "No"}</h5>
                                            <span>Published</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6>Title</h6>
                                    <h4>{post.title}</h4>
                                </div>

                                {post.descriptions && (
                                    <div className="mb-4">
                                        <h6>Descriptions</h6>
                                        <div className="border rounded p-3 bg-light" style={{ whiteSpace: 'pre-wrap' }}>
                                            {post.descriptions}
                                        </div>
                                    </div>
                                )}

                                {post.address && (
                                    <div className="mb-4">
                                        <h6>Address</h6>
                                        <p>{post.address}</p>
                                    </div>
                                )}

                                <div className="row mb-4">
                                    <div className="col-md-3">
                                        <strong>Distance:</strong> {post.distance ?? 'N/A'}
                                    </div>
                                    <div className="col-md-3">
                                        <strong>Duration:</strong> {post.duration ?? 'N/A'}
                                    </div>
                                    <div className="col-md-3">
                                        <strong>Pace:</strong> {post.pace ?? 'N/A'}
                                    </div>
                                    <div className="col-md-3">
                                        <strong>Elevation:</strong> {post.elevation ?? 'N/A'}
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="border rounded p-3">
                                            <h6>Start Point</h6>
                                            <p className="mb-1"><strong>Location:</strong> {post.start_location ?? 'N/A'}</p>
                                            <p className="mb-1"><strong>Latitude:</strong> {post.start_latitude ?? 'N/A'}</p>
                                            <p className="mb-0"><strong>Longitude:</strong> {post.start_longitude ?? 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="border rounded p-3">
                                            <h6>End Point</h6>
                                            <p className="mb-1"><strong>Location:</strong> {post.end_location ?? 'N/A'}</p>
                                            <p className="mb-1"><strong>Latitude:</strong> {post.end_latitude ?? 'N/A'}</p>
                                            <p className="mb-0"><strong>Longitude:</strong> {post.end_longitude ?? 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Images */}
                                {post.images && post.images.length > 0 && (
                                    <div className="mb-4">
                                        <h6>Images</h6>

                                        <div className="row">
                                            {post.images.map(
                                                (
                                                    image: any,
                                                    index: number
                                                ) => (
                                                    <div
                                                        className="col-md-3 mb-3"
                                                        key={index}
                                                    >
                                                        <img
                                                            src={"/" + image['image']}
                                                            alt={`Post ${index}`}
                                                            className="img-fluid rounded border"
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}