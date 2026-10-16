import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ProductImage {
    id: number;
    url?: string | null;
    image?: string | null;
}

interface Category {
    id: number;
    name: string;
}

interface Seller {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
}

interface Product {
    id: number;
    user_id?: number | null;
    title: string;
    category_id?: number | null;
    description?: string | null;
    price: number | string;
    status: boolean;
    images?: ProductImage[];
}

interface Props {
    product: Product;
    categories: Category[];
    sellers: Seller[];
}

const imageUrl = (image: ProductImage) => {
    if (image.url) {
        return image.url;
    }

    return image.image
        ? `/storage/${image.image}`
        : '/backend/assets/images/placholder.png';
};

const sellerName = (seller?: Seller) => {
    const name =
        `${seller?.first_name ?? ''} ${seller?.last_name ?? ''}`.trim();

    return name || seller?.email || 'Unknown Seller';
};

interface SellerSelectProps {
    error?: string;
    onChange: (value: string) => void;
    sellers: Seller[];
    value: string;
}

function SellerSelect({ error, onChange, sellers, value }: SellerSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedSeller = sellers.find(
        (seller) => String(seller.id) === value,
    );

    const filteredSellers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return sellers;
        }

        return sellers.filter((seller) =>
            `${sellerName(seller)} ${seller.email ?? ''}`
                .toLowerCase()
                .includes(query),
        );
    }, [search, sellers]);

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
        };
    }, []);

    return (
        <div className="mb-20" ref={wrapperRef}>
            <label className="label fs-16 mb-2">Seller</label>

            <div className="position-relative">
                <button
                    className={`form-control d-flex align-items-center justify-content-between bg-white text-start ${error ? 'is-invalid' : ''}`}
                    onClick={() => setOpen((current) => !current)}
                    style={{ minHeight: '58px' }}
                    type="button"
                >
                    <span
                        className={selectedSeller ? 'text-body' : 'text-muted'}
                    >
                        {selectedSeller
                            ? sellerName(selectedSeller)
                            : 'Select Seller'}
                    </span>
                    <i className="ri-arrow-down-s-line fs-20 text-muted"></i>
                </button>

                {open && (
                    <div
                        className="position-absolute rounded-1 start-0 end-0 z-3 mt-1 border bg-white shadow-sm"
                        style={{
                            maxHeight: '280px',
                            overflow: 'hidden',
                        }}
                    >
                        <div className="p-2">
                            <input
                                autoFocus
                                className="form-control"
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search seller"
                                type="text"
                                value={search}
                            />
                        </div>

                        <div style={{ maxHeight: '216px', overflowY: 'auto' }}>
                            {filteredSellers.length > 0 ? (
                                filteredSellers.map((seller) => (
                                    <button
                                        className={`d-flex align-items-center justify-content-between w-100 border-0 bg-transparent px-3 py-2 text-start ${String(seller.id) === value
                                            ? 'text-primary'
                                            : 'text-body'
                                            }`}
                                        key={seller.id}
                                        onClick={() => {
                                            onChange(String(seller.id));
                                            setSearch('');
                                            setOpen(false);
                                        }}
                                        type="button"
                                    >
                                        <span>
                                            <span className="d-block fw-medium">
                                                {sellerName(seller)}
                                            </span>
                                            {seller.email && (
                                                <span className="d-block fs-13 text-muted">
                                                    {seller.email}
                                                </span>
                                            )}
                                        </span>

                                        {String(seller.id) === value && (
                                            <i className="ri-check-line fs-18"></i>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-3 text-muted">
                                    No sellers found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="text-danger mt-1">{error}</div>}
        </div>
    );
}

export default function Edit({ product, categories, sellers }: Props) {
    const { data, setData, processing, post, errors } = useForm({
        title: product.title || '',
        user_id: product.user_id ? String(product.user_id) : '',
        category_id: product.category_id ? String(product.category_id) : '',
        description: product.description || '',
        price: String(product.price ?? ''),
        status: Boolean(product.status),
        images: [] as File[],
        deleted_image_ids: [] as number[],
        _method: 'put',
    });

    const previews = useMemo(
        () => data.images.map((image) => URL.createObjectURL(image)),
        [data.images],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/admin/product/${product.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Product" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card rounded-10 mb-4 border border-white bg-white p-20">
                        <h3 className="mb-20">Edit Product</h3>

                        <form onSubmit={submit}>
                            {Object.keys(errors).length > 0 && (
                                <div className="alert alert-danger mb-20">
                                    <ul className="mb-0 ps-3">
                                        {Object.values(errors).map(
                                            (error, index) => (
                                                <li key={index}>{error}</li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

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
                                    <SellerSelect
                                        error={errors.user_id}
                                        onChange={(value) =>
                                            setData('user_id', value)
                                        }
                                        sellers={sellers}
                                        value={data.user_id}
                                    />
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
                                                <option value="">
                                                    Select Category
                                                </option>
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
                                            Update Product
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

                        {product.images && product.images.length > 0 && (
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Current Images
                                </label>
                                <div className="d-flex flex-wrap gap-2">
                                    {product.images
                                        .filter((img) => !data.deleted_image_ids?.includes(img.id))
                                        .map((image) => (
                                            <div key={image.id} className="position-relative" style={{ width: '72px', height: '72px' }}>
                                                <img
                                                    alt="Product"
                                                    src={imageUrl(image)}
                                                    className="rounded border"
                                                    style={{
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        width: '100%',
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const currentDeleted = data.deleted_image_ids || [];
                                                        setData('deleted_image_ids', [...currentDeleted, image.id]);
                                                    }}
                                                    className="position-absolute top-0 end-0 bg-danger text-white rounded-circle border-0 d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        marginTop: '-5px',
                                                        marginRight: '-5px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        <div className="form-group only-file-upload mb-4">
                            <label className="label fs-16">
                                Upload New Images
                            </label>
                            <div
                                className="form-control position-relative p-lg-5 h-100 p-4 text-center"
                                style={{ minHeight: '150px' }}
                            >
                                <label className="file-upload mb-0">
                                    <i className="ri-folder-image-line bg-opacity-10 rounded-1 bg-primary p-2 text-primary"></i>
                                    <span className="d-block text-body fs-14">
                                        Drag and drop new images or
                                        <span className="text-decoration-underline text-primary ms-1">
                                            Browse
                                        </span>
                                    </span>
                                </label>

                                <label className="position-absolute cursor active start-0 end-0 top-0 bottom-0 mb-0">
                                    <input
                                        accept="image/*"
                                        className="form__file bottom-0"
                                        multiple
                                        onChange={(e) => {
                                            const selected = Array.from(e.target.files ?? []);
                                            setData('images', [...data.images, ...selected]);
                                        }}
                                        type="file"
                                    />
                                </label>
                            </div>
                        </div>

                        {previews.length > 0 && (
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    New Images Previews
                                </label>
                                <div className="d-flex flex-wrap gap-2">
                                    {previews.map((preview, index) => (
                                        <div key={preview} className="position-relative" style={{ width: '72px', height: '72px' }}>
                                            <img
                                                alt="Product preview"
                                                src={preview}
                                                className="rounded border"
                                                style={{
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('images', data.images.filter((_, i) => i !== index));
                                                }}
                                                className="position-absolute top-0 end-0 bg-danger text-white rounded-circle border-0 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    marginTop: '-5px',
                                                    marginRight: '-5px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                    zIndex: 10,
                                                }}
                                            >
                                                <i className="ri-close-line"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
