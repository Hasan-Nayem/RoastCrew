import { Head, useForm } from "@inertiajs/react";
import React from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        caption: "",
        video: null as File | null,
        thumbnail: null as File | null,
        status: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/reels/store", {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Create Reel" />

            <div className="card bg-white border border-white rounded-10 p-20">
                <div className="mb-20">
                    <h3 className="mb-1 fs-22">Create Reel</h3>
                    <p className="fs-16">Add a new reel.</p>
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
                        <input
                            type="file"
                            className="form-control"
                            accept="video/*"
                            onChange={(e) => setData("video", e.target.files?.[0] || null)}
                        />
                        {errors.video && <div className="text-danger mt-1">{errors.video}</div>}
                    </div>

                    {/* <div className="mb-20">
                        <label className="label fs-16 mb-2">Thumbnail (jpeg, png, jpg, gif)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setData("thumbnail", e.target.files?.[0] || null)}
                        />
                        {errors.thumbnail && <div className="text-danger mt-1">{errors.thumbnail}</div>}
                    </div> */}

                    {/* <div className="mb-20">
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
                    </div> */}

                    <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                        Create Reel
                    </button>
                </form>
            </div>
        </>
    );
}
