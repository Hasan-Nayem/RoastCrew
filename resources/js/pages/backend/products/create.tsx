import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    const { data, setData, processing, post, errors } = useForm({
        title: '',
        category_id: '',
        description: '',
        price: '',
        status: true,
        images: [] as File[],
    });

    const previews = useMemo(
        () => data.images.map((image) => URL.createObjectURL(image)),
        [data.images],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/product', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Add Product" />

            <div className="row">
                <div className="col-lg-8">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <h3 className="mb-20">Add Product</h3>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Product Title
                                        </label>

                                        <div className="form-floating">
                                            <input
                                                className="form-control"
                                                onChange={(e) =>
                                                    setData(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Product title"
                                                type="text"
                                                value={data.title}
                                            />
                                            <label>Product title</label>
                                        </div>

                                        {errors.title && (
                                            <div className="text-danger mt-1">
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Category
                                        </label>

                                        <div className="form-floating">
                                            <select
                                                className="form-select form-control"
                                                onChange={(e) =>
                                                    setData(
                                                        'category_id',
                                                        e.target.value,
                                                    )
                                                }
                                                value={data.category_id}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <label>Category</label>
                                        </div>

                                        {errors.category_id && (
                                            <div className="text-danger mt-1">
                                                {errors.category_id}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Price
                                        </label>

                                        <div className="form-floating">
                                            <input
                                                className="form-control"
                                                min="0"
                                                onChange={(e) =>
                                                    setData(
                                                        'price',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Price"
                                                step="0.01"
                                                type="number"
                                                value={data.price}
                                            />
                                            <label>Price</label>
                                        </div>

                                        {errors.price && (
                                            <div className="text-danger mt-1">
                                                {errors.price}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Description
                                        </label>

                                        <textarea
                                            className="form-control"
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Product description"
                                            rows={6}
                                            value={data.description}
                                        />

                                        {errors.description && (
                                            <div className="text-danger mt-1">
                                                {errors.description}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-primary fw-normal text-white"
                                            disabled={processing}
                                            type="submit"
                                        >
                                            Add Product
                                        </button>

                                        <Link
                                            className="btn btn-danger fw-normal text-white"
                                            href="/admin/product"
                                        >
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <h3 className="mb-20">Product Status</h3>

                        <div className="form-check form-switch mb-20">
                            <input
                                checked={data.status}
                                className="form-check-input"
                                id="product-status"
                                onChange={(e) =>
                                    setData('status', e.target.checked)
                                }
                                type="checkbox"
                            />
                            <label
                                className="form-check-label"
                                htmlFor="product-status"
                            >
                                Active
                            </label>
                        </div>

                        {errors.status && (
                            <div className="text-danger mt-1">
                                {errors.status}
                            </div>
                        )}
                    </div>

                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <h3 className="mb-20">Product Images</h3>

                        <div className="form-group only-file-upload mb-4">
                            <label className="label fs-16">Images</label>
                            <div
                                className="form-control position-relative p-lg-5 h-100 p-4 text-center"
                                style={{ minHeight: '180px' }}
                            >
                                {previews.length > 0 ? (
                                    <div className="d-flex justify-content-center flex-wrap gap-2">
                                        {previews.map((preview) => (
                                            <img
                                                alt="Product preview"
                                                key={preview}
                                                src={preview}
                                                style={{
                                                    height: '72px',
                                                    objectFit: 'cover',
                                                    width: '72px',
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <label className="file-upload mb-0">
                                        <i className="ri-folder-image-line bg-opacity-10 rounded-1 bg-primary p-2 text-primary"></i>
                                        <span className="d-block text-body fs-14">
                                            Drag and drop images or
                                            <span className="text-decoration-underline text-primary">
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
                                                    e.target.files ?? [],
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
                </div>
            </div>
        </>
    );
}
