import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    status: boolean;
    product_count: number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface CategoriesPagination {
    data: Category[];
    links: PaginationLink[];
    total: number;
    from: number;
    to: number;
}

interface Props {
    categories: CategoriesPagination;
    filters: {
        search?: string;
    };
}

export default function Index({ categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const deleteCategory = (id: number) => {
        Swal.fire({
            title: 'Delete Category?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/category/${id}`);
            }
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/admin/category',
                { search },
                { preserveState: true, replace: true },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const resetFilters = () => {
        setSearch('');
        router.get('/admin/category');
    };

    return (
        <>
            <Head title="Category List" />

            <div
                className="main-content-container overflow-hidden"
                style={{ minHeight: '75vh' }}
            >
                <div className="row">
                    <div className="col-md-12">
                        <div className="card rounded-10 mb-4 border border-white bg-white">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link
                                    className="fs-16 border-0 bg-transparent p-0 text-primary"
                                    href="/admin/category/create"
                                >
                                    + Add New Category
                                </Link>

                                {/* Filters */}
                                <div className="d-flex align-items-center flex-wrap gap-2">
                                    <input
                                        className="form-control"
                                        placeholder="Search by name or slug"
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        style={{ width: '250px' }}
                                    />

                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="default-table-area mx-minus-1 table-to-do-list">
                                <div className="table-responsive">
                                    <table className="table w-100 align-middle">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Slug</th>
                                                <th>Products</th>
                                                <th>Status</th>
                                                <th>Created</th>
                                                <th className="text-end">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {categories.data.length > 0 ? (
                                                categories.data.map(
                                                    (category, index) => (
                                                        <tr key={category.id}>
                                                            <td>{index + 1}</td>

                                                            <td>
                                                                <img
                                                                    src={
                                                                        category.image
                                                                            ? `/${category.image}`
                                                                            : '/backend/assets/images/placholder.png'
                                                                    }
                                                                    alt={
                                                                        category.name
                                                                    }
                                                                    className="rounded-2"
                                                                    style={{
                                                                        width: '42px',
                                                                        height: '42px',
                                                                        objectFit:
                                                                            'cover',
                                                                    }}
                                                                />
                                                            </td>

                                                            <td>
                                                                <h4 className="fw-medium fs-16 mb-0">
                                                                    {
                                                                        category.name
                                                                    }
                                                                </h4>
                                                            </td>

                                                            <td>
                                                                <span className="fs-14 text-muted">
                                                                    {
                                                                        category.slug
                                                                    }
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="badge bg-info bg-opacity-10 text-info">
                                                                    {
                                                                        category.product_count
                                                                    }{' '}
                                                                    products
                                                                </span>
                                                            </td>

                                                            <td>
                                                                {category.status ? (
                                                                    <span className="badge bg-success bg-opacity-10 text-success">
                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-danger bg-opacity-10 text-danger">
                                                                        Inactive
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td>
                                                                {new Date(
                                                                    category.created_at,
                                                                ).toLocaleDateString(
                                                                    'en-US',
                                                                    {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                    },
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
                                                                        href={`/admin/category/show/${category.id}`}
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                            visibility
                                                                        </i>
                                                                    </Link>

                                                                    <Link
                                                                        className="hover-text-primary border-0 bg-transparent p-0"
                                                                        href={`/admin/category/edit/${category.id}`}
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                            edit
                                                                        </i>
                                                                    </Link>

                                                                    <button
                                                                        onClick={() =>
                                                                            deleteCategory(
                                                                                category.id,
                                                                            )
                                                                        }
                                                                        className="hover-text-danger border-0 bg-transparent p-0"
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
                                                        colSpan={8}
                                                        className="py-5 text-center"
                                                    >
                                                        No categories found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20 pt-20">
                                    <span className="fs-14 text-muted">
                                        {categories.total > 0
                                            ? `Showing ${categories.from}–${categories.to} of ${categories.total} categories`
                                            : 'No categories'}
                                    </span>

                                    <ul className="pagination mb-0">
                                        {categories.links.map((link, index) => (
                                            <li
                                                key={index}
                                                className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                            >
                                                <button
                                                    type="button"
                                                    className="page-link"
                                                    disabled={!link.url}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            router.visit(
                                                                link.url,
                                                                {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
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
