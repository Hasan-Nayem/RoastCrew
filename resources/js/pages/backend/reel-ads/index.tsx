import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useState } from "react";
import React from "react";

interface ReelAd {
    id: number;
    title: string;
    video_url: string;
    thumbnail_url: string;
    target_url: string;
    status: boolean;
    views: number;
    clicks: number;
}

interface PaginationData {
    data: ReelAd[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    ads: PaginationData;
    filters?: {
        search?: string;
    };
}

export default function Index({ ads, filters }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [search, setSearch] = useState(filters?.search || "");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        router.get('/admin/reel-ads', { search: val }, { preserveState: true, replace: true });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(ads.data.map(ad => ad.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const deleteAd = (id: number) => {
        Swal.fire({
            title: "Delete Reel Ad?",
            text: "This action cannot be undone and will delete the video from Mux!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete Ad",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/reel-ads/delete/${id}`, {
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
            title: "Delete Selected Ads?",
            text: "This action cannot be undone and will delete videos from Mux!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete selected",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/admin/reel-ads/bulk-delete`, { ids: selectedIds }, {
                    onSuccess: () => {
                        setSelectedIds([]);
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Reel Ads" />

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 mt-1">
                <div>
                    <h3 className="mb-0">Reel Ads</h3>
                    <p className="fs-16">Manage ads shown between reels.</p>
                </div>

                <div className="d-flex gap-2">
                    {selectedIds.length > 0 && (
                        <button onClick={bulkDelete} className="btn btn-danger">
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                </div>
            </div>

            <div className="card bg-white rounded-10 border border-white mb-4">
                <div className="p-4 d-flex justify-content-between align-items-center">
                    <Link href={"/admin/reel-ads/create"} className="">+ Add new Ad</Link>
                    <input 
                        type="text" 
                        className="form-control w-25" 
                        placeholder="Search by Title..." 
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
                                                checked={selectedIds.length === ads.data.length && ads.data.length > 0}
                                            />
                                        </div>
                                    </th>
                                    <th className="fw-medium" scope="col">ID</th>
                                    <th className="fw-medium" scope="col">Thumbnail</th>
                                    <th className="fw-medium" scope="col">Title</th>
                                    <th className="fw-medium" scope="col">Views</th>
                                    <th className="fw-medium" scope="col">Clicks</th>
                                    <th className="fw-medium" scope="col">Status</th>
                                    <th className="fw-medium text-end" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ads.data.length > 0 ? (
                                    ads.data.map((ad) => (
                                        <tr key={ad.id}>
                                            <td className="pe-0">
                                                <div className="form-check">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        checked={selectedIds.includes(ad.id)}
                                                        onChange={() => handleSelect(ad.id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-body pe-0 rtl-pe">{ad.id}</td>
                                            <td className="text-body">
                                                {ad.thumbnail_url ? (
                                                    <img src={ad.thumbnail_url} alt="thumbnail" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                                                ) : "No Thumbnail"}
                                            </td>
                                            <td className="text-body">{ad.title}</td>
                                            <td className="text-body">{ad.views}</td>
                                            <td className="text-body">{ad.clicks}</td>
                                            <td className="">
                                                <span className={ad.status
                                                    ? "text-success bg-success bg-opacity-10 fs-15 fw-normal d-inline-block default-badge"
                                                    : "text-danger bg-danger bg-opacity-10 fs-15 fw-normal d-inline-block default-badge"}
                                                >
                                                    {ad.status ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="">
                                                <div className="d-flex justify-content-end" style={{ gap: "12px" }}>
                                                    <Link href={`/admin/reel-ads/show/${ad.id}`} className="bg-transparent p-0 border-0 hover-text-info" data-bs-placement="top" data-bs-title="Show" data-bs-toggle="tooltip">
                                                        <i className="material-symbols-outlined fs-16 fw-normal text-info">visibility</i>
                                                    </Link>
                                                    <Link href={`/admin/reel-ads/edit/${ad.id}`} className="bg-transparent p-0 border-0 hover-text-success" data-bs-placement="top" data-bs-title="Edit" data-bs-toggle="tooltip">
                                                        <i className="material-symbols-outlined fs-16 fw-normal text-primary">Edit</i>
                                                    </Link>
                                                    <button className="bg-transparent p-0 border-0 hover-text-danger" onClick={() => deleteAd(ad.id)} data-bs-placement="top" data-bs-title="Delete" data-bs-toggle="tooltip">
                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">delete</i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center">No Ads found</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <div className="bg-transparent border-0" style={{height: "20px"}}></div>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination">
                        {ads.links.map((link, index) => (
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
