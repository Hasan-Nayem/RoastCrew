import { Head, useForm } from "@inertiajs/react";
import React from "react";

interface ReelAd {
    id: number;
    title: string;
    video_url: string;
    thumbnail_url: string;
    target_url: string;
    status: boolean;
}

interface Props {
    ad: ReelAd;
}

export default function Edit({ ad }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: ad.title || "",
        video: null as File | null,
        target_url: ad.target_url || "",
        status: ad.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/reel-ads/update/${ad.id}`, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Edit Reel Ad" />

            <div className="card bg-white border border-white rounded-10 p-20">
                <div className="mb-20">
                    <h3 className="mb-1 fs-22">Edit Reel Ad</h3>
                    <p className="fs-16">Update the ad details.</p>
                </div>

                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="mb-20">
                        <label className="label fs-16 mb-2">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        {errors.title && <div className="text-danger mt-1">{errors.title}</div>}
                    </div>

                    <div className="mb-20">
                        <label className="label fs-16 mb-2">Video (mp4, mov, avi, wmv)</label>
                        {ad.thumbnail_url && (
                            <div className="mb-2">
                                <img src={ad.thumbnail_url} alt="thumbnail" style={{ width: "100px", objectFit: "cover", borderRadius: "4px" }} />
                            </div>
                        )}
                        <input
                            type="file"
                            className="form-control"
                            accept="video/*"
                            onChange={(e) => setData("video", e.target.files?.[0] || null)}
                        />
                        <small className="text-muted">Leave blank to keep the current video. Uploading a new one will replace the old Mux asset.</small>
                        {errors.video && <div className="text-danger mt-1">{errors.video}</div>}
                    </div>

                    <div className="mb-20">
                        <label className="label fs-16 mb-2">Target URL (Optional)</label>
                        <input
                            type="url"
                            className="form-control"
                            value={data.target_url}
                            onChange={(e) => setData("target_url", e.target.value)}
                        />
                        {errors.target_url && <div className="text-danger mt-1">{errors.target_url}</div>}
                    </div>

                    <div className="mb-20">
                        <label className="label fs-16 mb-2">Status</label>
                        <select
                            className="form-select"
                            value={data.status ? "1" : "0"}
                            onChange={(e) => setData("status", e.target.value === "1")}
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        {errors.status && <div className="text-danger mt-1">{errors.status}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                        Update Ad
                    </button>
                </form>
            </div>
        </>
    );
}
