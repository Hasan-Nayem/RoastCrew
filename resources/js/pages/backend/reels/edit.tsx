import { Head, useForm } from "@inertiajs/react";
import React from "react";

interface Reel {
    id: number;
    caption: string;
    video_url: string;
    thumbnail_url: string;
    status: boolean;
}

interface Props {
    reel: Reel;
}

export default function Edit({ reel }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        caption: reel.caption || "",
        video: null as File | null,
        thumbnail: null as File | null,
        status: reel.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/reels/update/${reel.id}`, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Edit Reel" />

            <div className="card bg-white border border-white rounded-10 p-20">
                <div className="mb-20">
                    <h3 className="mb-1 fs-22">Edit Reel</h3>
                    <p className="fs-16">Update the reel details.</p>
                </div>

                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="mb-20">
                        <label className="label fs-16 mb-2">Caption</label>
                        <textarea
                            className="form-control"
                            value={data.caption}
                            onChange={(e) => setData("caption", e.target.value)}
                        ></textarea>
                        {errors.caption && <div className="text-danger mt-1">{errors.caption}</div>}
                    </div>

                    <div className="mb-20">
                        <label className="label fs-16 mb-2">Video (mp4, mov, avi, wmv)</label>
                        {reel.video_url && (
                            <div className="mb-2">
                                <a href={reel.video_url} target="_blank" rel="noreferrer">View Current Video</a>
                            </div>
                        )}
                        <input
                            type="file"
                            className="form-control"
                            accept="video/*"
                            onChange={(e) => setData("video", e.target.files?.[0] || null)}
                        />
                        <small className="text-muted">Leave blank to keep the current video.</small>
                        {errors.video && <div className="text-danger mt-1">{errors.video}</div>}
                    </div>

                    <div className="mb-20">
                        <label className="label fs-16 mb-2">Thumbnail (jpeg, png, jpg, gif)</label>
                        {reel.thumbnail_url && (
                            <div className="mb-2">
                                <img src={reel.thumbnail_url} alt="thumbnail" style={{ width: "100px", objectFit: "cover" }} />
                            </div>
                        )}
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setData("thumbnail", e.target.files?.[0] || null)}
                        />
                        <small className="text-muted">Leave blank to keep the current thumbnail.</small>
                        {errors.thumbnail && <div className="text-danger mt-1">{errors.thumbnail}</div>}
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
                        Update Reel
                    </button>
                </form>
            </div>
        </>
    );
}
