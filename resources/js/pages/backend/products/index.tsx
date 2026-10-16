import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProductImage {
    id: number;
    url?: string | null;
    image?: string | null;
}

interface ProductUser {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
}

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    title: string;
    category_id?: number | null;
    category?: Category | null;
    description?: string | null;
    price: number | string;
    status: boolean;
    created_at?: string | null;
    images?: ProductImage[];
    user?: ProductUser | null;
}

interface ProductsPagination {
    data: Product[];
    links: PaginationLink[];
}

interface Props {
    products: ProductsPagination;
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string | number;
    };
}

const productImage = (product: Product) => {
    const image = product.images?.[0];

    if (image?.url) {
        return image.url;
    }

    if (image?.image) {
        return `/storage/${image.image}`;
    }

    return '/backend/assets/images/placholder.png';
};

const sellerName = (product: Product) => {
    const name =
        `${product.user?.first_name ?? ''} ${product.user?.last_name ?? ''}`.trim();

    return name || product.user?.email || 'Unknown Seller';
};

const formatDate = (date?: string | null) => {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatPrice = (price: number | string) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price || 0));

export default function Index({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    const applyFilters = () => {
        router.get(
            '/admin/product',
            { search, category_id: categoryId },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setCategoryId('');
        router.get('/admin/product');
    };

    const deleteProduct = (id: number) => {
        Swal.fire({
            title: 'Delete Product?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete product',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/product/${id}`, {
                    preserveScroll: true,
                });
            }
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/admin/product',
                { search, category_id: categoryId },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, categoryId]);

    return (
        <>
            <Head title="Product List" />

            <div
                className="main-content-container overflow-hidden"
                style={{ minHeight: '75vh' }}
            >
                <div className="row">
                    <div className="col-md-12">
                        <div className="card rounded-10 mb-4 border border-white bg-white">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link
                                    className="fs-16 border-0 bg-transparent p-0 text-primary"
                                    href="/admin/product/create"
                                >
                                    + Add New Product
                                </Link>

                                <div className="d-flex align-items-center flex-wrap gap-2">
                                    <input
                                        className="form-control"
                                        placeholder="Search by title or description"
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        style={{ width: '280px' }}
                                    />

                                    <select
                                        className="form-select"
                                        value={categoryId}
                                        onChange={(e) =>
                                            setCategoryId(e.target.value)
                                        }
                                        style={{ width: '200px' }}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="btn btn-primary text-white"
                                        onClick={applyFilters}
                                        type="button"
                                    >
                                        Filter
                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetFilters}
                                        type="button"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <div className="default-table-area mx-minus-1 table-to-do-list">
                                <div className="table-responsive">
                                    <table className="table w-100 align-middle">
                                        <thead>
                                            <tr>
                                                <th>Product ID</th>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Seller</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Created At</th>
                                                <th className="text-end">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {products.data.length > 0 ? (
                                                products.data.map(
                                                    (product, index) => (
                                                        <tr key={product.id}>
                                                            <td>
                                                                #{index + 1}
                                                            </td>

                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="flex-shrink-0">
                                                                        <img
                                                                            alt={
                                                                                product.title
                                                                            }
                                                                            className="rounded-circle"
                                                                            src={productImage(
                                                                                product,
                                                                            )}
                                                                            style={{
                                                                                width: '35px',
                                                                                height: '35px',
                                                                                objectFit:
                                                                                    'cover',
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="ms-12 flex-grow-1">
                                                                        <h4 className="fw-medium fs-16 mb-0">
                                                                            {
                                                                                product.title
                                                                            }
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <span className="badge bg-info bg-opacity-10 text-info">
                                                                    {product
                                                                        .category
                                                                        ?.name ||
                                                                        'Uncategorized'}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                {sellerName(
                                                                    product,
                                                                )}
                                                            </td>

                                                            <td>
                                                                {formatPrice(
                                                                    product.price,
                                                                )}
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={`badge ${
                                                                        product.status
                                                                            ? 'bg-success'
                                                                            : 'bg-secondary'
                                                                    }`}
                                                                >
                                                                    {product.status
                                                                        ? 'Active'
                                                                        : 'Inactive'}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                {formatDate(
                                                                    product.created_at,
                                                                )}
                                                            </td>

                                                            <td>
                                                                <div
                                                                    className="d-flex justify-content-end"
                                                                    style={{
                                                                        gap: '12px',
                                                                    }}
                                                                >
                                                                    <Link
                                                                        className="hover-text-success border-0 bg-transparent p-0"
                                                                        href={`/admin/product/show/${product.id}`}
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                            Visibility
                                                                        </i>
                                                                    </Link>

                                                                    <Link
                                                                        className="hover-text-success border-0 bg-transparent p-0"
                                                                        href={`/admin/product/edit/${product.id}`}
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                            edit
                                                                        </i>
                                                                    </Link>

                                                                    <button
                                                                        className="hover-text-danger border-0 bg-transparent p-0"
                                                                        onClick={() =>
                                                                            deleteProduct(
                                                                                product.id,
                                                                            )
                                                                        }
                                                                        type="button"
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                            delete
                                                                        </i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="py-5 text-center"
                                                        colSpan={8}
                                                    >
                                                        No products found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20 pt-20">
                                    <span className="fs-14 text-muted">
                                        Showing {products.data.length} products
                                    </span>

                                    <ul className="pagination mb-0">
                                        {products.links.map((link, index) => (
                                            <li
                                                className={`page-item ${link.active ? 'active' : ''} ${
                                                    !link.url ? 'disabled' : ''
                                                }`}
                                                key={index}
                                            >
                                                <button
                                                    className="page-link"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                    disabled={!link.url}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            router.visit(
                                                                link.url,
                                                                {
                                                                    preserveScroll: true,
                                                                    preserveState: true,
                                                                },
                                                            );
                                                        }
                                                    }}
                                                    type="button"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
