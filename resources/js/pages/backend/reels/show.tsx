import { Head, Link } from "@inertiajs/react";
import React from "react";
import MuxPlayer from "@mux/mux-player-react";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string | null;
}

interface ReelComment {
    id: number;
    comment: string;
    created_at: string;
    user: User;
}

interface Reel {
    id: number;
    caption: string;
    video_url: string;
    thumbnail_url: string;
    status: boolean;
    views: number;
    likes: number;
    comments: number;
    user: User;
    reel_comments: ReelComment[];
}

interface Props {
    reel: Reel;
}

export default function Show({ reel }: Props) {
    return (
        <>
            <Head title="Reel Details" />

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 mt-1">
                <div>
                    <h3 className="mb-0">Reel Details</h3>
                    <p className="fs-16">View information and comments for this reel.</p>
                </div>
                <Link href={"/admin/reels"} className="btn btn-outline-secondary">
                    Back to List
                </Link>
            </div>

            <div className="row">
                <div className="col-md-5">
                    <div className="card bg-white border border-white rounded-10 p-20 mb-4">
                        <h4 className="fs-18 mb-3">Reel Information</h4>
                        {reel.video_url && (
                            <div className="mb-3">
                                <MuxPlayer 
                                    src={reel.video_url} 
                                    style={{ width: "100%", borderRadius: "8px", aspectRatio: "16/9" }} 
                                />
                            </div>
                        )}
                        <table className="table table-bordered align-middle">
                            <tbody>
                                <tr>
                                    <th className="fw-medium w-25">ID</th>
                                    <td>{reel.id}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Author</th>
                                    <td>{reel.user?.first_name} {reel.user?.last_name}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Caption</th>
                                    <td>{reel.caption || "N/A"}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Views</th>
                                    <td>{reel.views}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Likes</th>
                                    <td>{reel.likes}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Comments Count</th>
                                    <td>{reel.comments}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Status</th>
                                    <td>
                                        <span className={reel.status ? "text-success" : "text-danger"}>
                                            {reel.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card bg-white border border-white rounded-10 p-20 mb-4">
                        <h4 className="fs-18 mb-3">Comments List</h4>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">User</th>
                                        <th scope="col">Comment</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reel.reel_comments && reel.reel_comments.length > 0 ? (
                                        reel.reel_comments.map((comment) => (
                                            <tr key={comment.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {comment.user?.avatar ? (
                                                            <img 
                                                                src={comment.user.avatar} 
                                                                alt="avatar" 
                                                                className="rounded-circle me-2" 
                                                                style={{ width: "30px", height: "30px", objectFit: "cover" }} 
                                                            />
                                                        ) : (
                                                            <div 
                                                                className="bg-secondary rounded-circle me-2 d-flex justify-content-center align-items-center text-white" 
                                                                style={{ width: "30px", height: "30px" }}
                                                            >
                                                                {comment.user?.first_name?.charAt(0) || "U"}
                                                            </div>
                                                        )}
                                                        <span>{comment.user?.first_name} {comment.user?.last_name}</span>
                                                    </div>
                                                </td>
                                                <td>{comment.comment}</td>
                                                <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted">
                                                No comments found for this reel.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
