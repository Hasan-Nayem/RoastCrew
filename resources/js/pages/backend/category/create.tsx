import ImageUpload from "@/pages/widget/image-upload";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, processing, post, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        status: "1",
        image: null as File | null,
    });

    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            name: value,
            slug: value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-"),
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/admin/category", {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Create Category" />

            <div className="row">
                {/* Main Form */}
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Add Category</h3>

                        <form onSubmit={submit}>
                            {Object.keys(errors).length > 0 && (
                                <div className="alert alert-danger mb-20">
                                    <ul className="mb-0 ps-3">
                                        {Object.values(errors).map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="row">
                                {/* Name */}
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Category Name <span className="text-danger">*</span>
                                        </label>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                                placeholder="Category name"
                                                value={data.name}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                            />
                                            <label>Category name</label>
                                        </div>
                                        {errors.name && (
                                            <div className="text-danger mt-1">{errors.name}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Slug */}
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">Slug</label>
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                                                placeholder="category-slug"
                                                value={data.slug}
                                                onChange={(e) => setData("slug", e.target.value)}
                                            />
                                            <label>Auto-generated from name</label>
                                        </div>
                                        {errors.slug && (
                                            <div className="text-danger mt-1">{errors.slug}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-lg-12">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">Description</label>
                                        <textarea
                                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                            placeholder="Enter category description..."
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                        />
                                        {errors.description && (
                                            <div className="text-danger mt-1">{errors.description}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="col-lg-12">
                                    <ImageUpload
                                        label="Category Image"
                                        file={data.image}
                                        onChange={(file) => setData("image", file)}
                                    />
                                    {errors.image && (
                                        <div className="text-danger mt-1">{errors.image}</div>
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
                                            {processing ? "Saving..." : "Add Category"}
                                        </button>

                                        <Link
                                            href="/admin/category"
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

                {/* Sidebar - Status */}
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Visibility</h3>

                        <div>
                            <label className="label fs-16 mb-2">Status</label>

                            <div className="form-floating">
                                <select
                                    className="form-select form-control"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                <label>Select status</label>
                            </div>

                            {errors.status && (
                                <div className="text-danger mt-1">{errors.status}</div>
                            )}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Tips</h3>
                        <ul className="ps-3 text-muted fs-14 mb-0">
                            <li className="mb-2">The slug is auto-generated from the name but can be manually edited.</li>
                            <li className="mb-2">Use a clear, descriptive name for better SEO.</li>
                            <li>Recommended image size: 400×400 px.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}