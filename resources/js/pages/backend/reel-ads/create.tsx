import { Head, useForm } from "@inertiajs/react";
import React from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        video: null as File | null,
        target_url: "",
        status: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/reel-ads/store", {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Create Reel Ad" />

            <div className="card bg-white border border-white rounded-10 p-20">
                <div className="mb-20">
                    <h3 className="mb-1 fs-22">Create Reel Ad</h3>
                    <p className="fs-16">Add a new ad to be shown between reels.</p>
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
                        <input
                            type="file"
                            className="form-control"
                            accept="video/*"
                            onChange={(e) => setData("video", e.target.files?.[0] || null)}
                        />
                        <small className="text-muted">This video will be uploaded to Mux.</small>
                        {errors.video && <div className="text-danger mt-1">{errors.video}</div>}
                    </div>

                    <div className="mb-20">
                        <label className="label fs-16 mb-2">Target URL (Optional)</label>
                        <input
                            type="url"
                            className="form-control"
                            value={data.target_url}
                            onChange={(e) => setData("target_url", e.target.value)}
                            placeholder="https://example.com"
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
                        Create Ad
                    </button>
                </form>
            </div>
        </>
    );
}
