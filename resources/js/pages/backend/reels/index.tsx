import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useState } from "react";

interface Reel {
    id: number;
    caption: string;
    video_url: string;
    thumbnail_url: string;
    status: boolean;
    views: number;
    likes: number;
    user?: {
        first_name: string;
        last_name: string;
        avatar: string | null;
    };
}

interface PaginationData {
    data: Reel[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    reels: PaginationData;
    filters?: {
        search?: string;
    };
}

export default function Index({ reels, filters }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [search, setSearch] = useState(filters?.search || "");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        router.get('/admin/reels', { search: val }, { preserveState: true, replace: true });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(reels.data.map(reel => reel.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const deleteReel = (id: number) => {
        Swal.fire({
            title: "Delete Reel?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete Reel",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/reels/delete/${id}`, {
                    onSuccess: () => {
                        setSelectedIds(prev => prev.filter(item => item !== id));
                    },
                });
            }
        });
    };

    const bulkDelete = () => {
        if (selectedIds.length === 0) return;
        Swal.fire({
            title: "Delete Selected Reels?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete selected",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/admin/reels/bulk-delete`, { ids: selectedIds }, {
                    onSuccess: () => {
                        setSelectedIds([]);
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Reels" />

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 mt-1">
                <div>
                    <h3 className="mb-0">Reels</h3>
                    <p className="fs-16">Manage reels.</p>
                </div>

                <div className="d-flex gap-2">
                    {selectedIds.length > 0 && (
                        <button onClick={bulkDelete} className="btn btn-danger text-white">
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                </div>
            </div> 

            <div className="card bg-white rounded-10 border border-white mb-4">
                <div className="p-4 d-flex justify-content-between align-items-center">
                    <Link href={"/admin/reels/create"} className="">+ Add new Reel</Link>
                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Search by Author or Caption..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <div className="default-table-area mx-minus-1 table-contact-list">
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="fw-medium pe-0" scope="col">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={selectedIds.length === reels.data.length && reels.data.length > 0}
                                            />
                                        </div>
                                    </th>
                                    <th className="fw-medium" scope="col">ID</th>
                                    <th className="fw-medium" scope="col">Thumbnail</th>
                                    <th className="fw-medium" scope="col">Author</th>
                                    <th className="fw-medium" scope="col">Caption</th>
                                    <th className="fw-medium" scope="col">Views</th>
                                    <th className="fw-medium" scope="col">Status</th>
                                    <th className="fw-medium text-end" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reels.data.length > 0 ? (
                                    reels.data.map((reel) => (
                                        <tr key={reel.id}>
                                            <td className="pe-0">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={selectedIds.includes(reel.id)}
                                                        onChange={() => handleSelect(reel.id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-body pe-0 rtl-pe">{reel.id}</td>
                                            <td className="text-body">
                                                {reel.thumbnail_url ? (
                                                    <img src={reel.thumbnail_url} alt="thumbnail" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                                                ) : "No Thumbnail"}
                                            </td>
                                            <td className="text-body">
                                                {reel.user ? `${reel.user.first_name} ${reel.user.last_name}` : 'Unknown'}
                                            </td>
                                            <td className="text-body">{reel.caption || 'N/A'}</td>
                                            <td className="text-body">{reel.views}</td>
                                            <td className="">
                                                <span className={reel.status
                                                    ? "text-success bg-success bg-opacity-10 fs-15 fw-normal d-inline-block default-badge"
                                                    : "text-danger bg-danger bg-opacity-10 fs-15 fw-normal d-inline-block default-badge"}
                                                >
                                                    {reel.status ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="">
                                                <div className="d-flex justify-content-end" style={{ gap: "12px" }}>
                                                    <Link href={`/admin/reels/show/${reel.id}`} className="bg-transparent p-0 border-0 hover-text-info" data-bs-placement="top" data-bs-title="Show" data-bs-toggle="tooltip">
                                                        <i className="material-symbols-outlined fs-16 fw-normal text-info">visibility</i>
                                                    </Link>
                                                    <Link href={`/admin/reels/edit/${reel.id}`} className="bg-transparent p-0 border-0 hover-text-success" data-bs-placement="top" data-bs-title="Edit" data-bs-toggle="tooltip">
                                                        <i className="material-symbols-outlined fs-16 fw-normal text-primary">Edit</i>
                                                    </Link>
                                                    <button className="bg-transparent p-0 border-0 hover-text-danger" onClick={() => deleteReel(reel.id)} data-bs-placement="top" data-bs-title="Delete" data-bs-toggle="tooltip">
                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">delete</i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center">No Reels found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination UI based on links */}
            <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination">
                        {reels.links.map((link, index) => (
                            <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                {link.url ? (
                                    <Link className="page-link" href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span className="page-link" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}