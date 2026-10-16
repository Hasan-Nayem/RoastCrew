import { Head, Link } from "@inertiajs/react";
import React from "react";
import MuxPlayer from "@mux/mux-player-react";

interface ReelAd {
    id: number;
    title: string;
    video_url: string;
    thumbnail_url: string;
    target_url: string;
    status: boolean;
    views: number;
    clicks: number;
    created_at: string;
}

interface Props {
    ad: ReelAd;
}

export default function Show({ ad }: Props) {
    return (
        <>
            <Head title="Reel Ad Details" />

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 mt-1">
                <div>
                    <h3 className="mb-0">Reel Ad Details</h3>
                    <p className="fs-16">View information for this ad.</p>
                </div>
                <Link href={"/admin/reel-ads"} className="btn btn-outline-secondary">
                    Back to List
                </Link>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card bg-white border border-white rounded-10 p-20 mb-4">
                        <h4 className="fs-18 mb-3">Ad Media</h4>
                        {ad.video_url && (
                            <div className="mb-3">
                                <MuxPlayer 
                                    src={ad.video_url} 
                                    style={{ width: "100%", borderRadius: "8px", aspectRatio: "16/9" }} 
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card bg-white border border-white rounded-10 p-20 mb-4">
                        <h4 className="fs-18 mb-3">Ad Information</h4>
                        <table className="table table-bordered align-middle">
                            <tbody>
                                <tr>
                                    <th className="fw-medium w-25">ID</th>
                                    <td>{ad.id}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Title</th>
                                    <td>{ad.title}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Target URL</th>
                                    <td>
                                        {ad.target_url ? (
                                            <a href={ad.target_url} target="_blank" rel="noreferrer">
                                                {ad.target_url}
                                            </a>
                                        ) : "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Views</th>
                                    <td>{ad.views}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Clicks</th>
                                    <td>{ad.clicks}</td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Status</th>
                                    <td>
                                        <span className={ad.status ? "text-success" : "text-danger"}>
                                            {ad.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="fw-medium">Created At</th>
                                    <td>{new Date(ad.created_at).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
