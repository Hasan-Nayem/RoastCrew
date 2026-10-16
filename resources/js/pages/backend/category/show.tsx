import { Head, Link } from "@inertiajs/react";

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    status: boolean;
    product_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    category: Category;
}

export default function Show({ category }: Props) {
    const image =
        category.image && category.image !== "null"
            ? `/${category.image}`
            : "/backend/assets/images/placholder.png";

    return (
        <>
            <Head title={`Category - ${category.name}`} />

            <div className="row">
                {/* Image Card */}
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div
                            className="text-center"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <img
                                src={image}
                                alt={category.name}
                                className="rounded-2 mb-3 border border-1"
                                style={{
                                    width: "160px",
                                    height: "160px",
                                    objectFit: "cover",
                                }}
                            />

                            <h3 className="mb-1">{category.name}</h3>

                            <p className="text-muted mb-3 fs-14">{category.slug}</p>

                            {category.status ? (
                                <span className="badge bg-success text-capitalize fs-14">
                                    Active
                                </span>
                            ) : (
                                <span className="badge bg-danger text-capitalize fs-14">
                                    Inactive
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">Category Information</h3>

                            <div className="d-flex gap-2">
                                <Link
                                    href={`/admin/category/edit/${category.id}`}
                                    className="btn btn-primary text-white"
                                >
                                    Edit
                                </Link>

                                <Link
                                    href="/admin/category"
                                    className="btn btn-secondary"
                                >
                                    Back
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            {/* Name */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">
                                    Category Name
                                </label>
                                <div className="form-control bg-light">
                                    {category.name}
                                </div>
                            </div>

                            {/* Slug */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">
                                    Slug
                                </label>
                                <div className="form-control bg-light">
                                    {category.slug}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">
                                    Status
                                </label>
                                <div>
                                    {category.status ? (
                                        <span className="badge bg-success bg-opacity-10 text-success">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="badge bg-danger bg-opacity-10 text-danger">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Product Count */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">
                                    Total Products
                                </label>
                                <div>
                                    <span className="badge bg-info bg-opacity-10 text-info fs-14">
                                        {category.product_count} products
                                    </span>
                                </div>
                            </div>

                            {/* Created At */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">
                                    Created At
                                </label>
                                <div className="form-control bg-light">
                                    {new Date(category.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>

                            {/* Updated At */}
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">
                                    Last Updated
                                </label>
                                <div className="form-control bg-light">
                                    {new Date(category.updated_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            {category.description && (
                                <div className="col-md-12 mb-4">
                                    <label className="label fs-14 text-muted mb-2">
                                        Description
                                    </label>
                                    <div
                                        className="form-control bg-light"
                                        style={{ minHeight: "80px", whiteSpace: "pre-wrap" }}
                                    >
                                        {category.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}