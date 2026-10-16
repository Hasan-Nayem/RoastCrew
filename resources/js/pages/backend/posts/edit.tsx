import React from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';

/**
 * Admin Post Edit Page
 * Provides a comprehensive form for every attribute of the Post model.
 */
export default function PostEdit() {
  const { post, users } = usePage().props as any;

  const { data, setData, post: submitPost, processing, errors } = useForm({
    _method: 'put',
    user_id: post?.user_id ?? '',
    track_id: post?.track_id ?? '',
    title: post?.title ?? '',
    descriptions: post?.descriptions ?? '',
    address: post?.address ?? '',
    distance: post?.distance ?? '',
    duration: post?.duration ?? '',
    pace: post?.pace ?? '',
    elevation: post?.elevation ?? '',
    start_location: post?.start_location ?? '',
    start_latitude: post?.start_latitude ?? '',
    start_longitude: post?.start_longitude ?? '',
    end_location: post?.end_location ?? '',
    end_latitude: post?.end_latitude ?? '',
    end_longitude: post?.end_longitude ?? '',

    // Existing files (strings/paths)
    existing_images: post?.images ?? [],
    existing_audios: post?.audios ?? [],
    existing_videos: post?.videos ?? [],

    // New files to upload (File objects)
    images: [] as File[],
    audios: [] as File[],
    videos: [] as File[],

    is_published: !!post?.is_published,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPost(`/admin/posts/${post.id}`, {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title="Post Details" />

      <div
        className="main-content-container overflow-hidden"
        style={{ minHeight: "75vh" }}
      >
        <div className="row">
          <div className="col-lg-8">
            <div className="card bg-white p-4 border-0">
              <div className="card-body">
                <div className="container mx-auto p-4">
                  <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
                  <form onSubmit={handleSubmit} className="grid gap-4 max-w-2xl">
                    <div className="block">
                      <span className="text-gray-700">
                        Publisher (User)
                      </span>
                      <select
                        name="user_id"
                        className="form-control"
                        value={data.user_id}
                        onChange={(e) => setData('user_id', e.target.value)}
                        required
                      >
                        <option value="">Select User</option>
                        {users.map((user: any) => (
                          <option key={user.id} value={user.id}>
                            {user.name || user.first_name} ({user.email})
                          </option>
                        ))}
                      </select>
                      {errors.user_id && <div className="text-danger mt-1 fs-14">{errors.user_id}</div>}
                    </div>

                    <div className="block mt-3">
                      <span className="text-gray-700">Title</span>
                      <input
                        type="text"
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        required
                      />
                      {errors.title && <div className="text-danger mt-1 fs-14">{errors.title}</div>}
                    </div>

                    <div className="block mt-3">
                      <span className="text-gray-700">Descriptions</span>
                      <textarea
                        rows={6}
                        value={data.descriptions}
                        onChange={e => setData('descriptions', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                      {errors.descriptions && <div className="text-danger mt-1 fs-14">{errors.descriptions}</div>}
                    </div>

                    <div className="block mt-3">
                      <span className="text-gray-700">Track ID</span>
                      <input
                        type="number"
                        value={data.track_id}
                        onChange={e => setData('track_id', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                    </div>

                    <div className="block mt-3">
                      <span className="text-gray-700">Address</span>
                      <input
                        type="text"
                        value={data.address}
                        onChange={e => setData('address', e.target.value)}
                        className="mt-1 block w-full border rounded px-3 py-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 d-flex gap-3">
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">Distance</span>
                        <input
                          type="number"
                          step="any"
                          value={data.distance}
                          onChange={e => setData('distance', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">Duration</span>
                        <input
                          type="text"
                          value={data.duration}
                          onChange={e => setData('duration', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 d-flex gap-3">
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">Pace</span>
                        <input
                          type="text"
                          value={data.pace}
                          onChange={e => setData('pace', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">Elevation</span>
                        <input
                          type="number"
                          step="any"
                          value={data.elevation}
                          onChange={e => setData('elevation', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3 d-flex gap-3">
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">Start Location</span>
                        <input
                          type="text"
                          value={data.start_location}
                          onChange={e => setData('start_location', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">Start Latitude</span>
                        <input
                          type="number"
                          step="any"
                          value={data.start_latitude}
                          onChange={e => setData('start_latitude', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">Start Longitude</span>
                        <input
                          type="number"
                          step="any"
                          value={data.start_longitude}
                          onChange={e => setData('start_longitude', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3 d-flex gap-3">
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">End Location</span>
                        <input
                          type="text"
                          value={data.end_location}
                          onChange={e => setData('end_location', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">End Latitude</span>
                        <input
                          type="number"
                          step="any"
                          value={data.end_latitude}
                          onChange={e => setData('end_latitude', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div className="block flex-grow-1">
                        <span className="text-gray-700">End Longitude</span>
                        <input
                          type="number"
                          step="any"
                          value={data.end_longitude}
                          onChange={e => setData('end_longitude', e.target.value)}
                          className="mt-1 block w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="block mt-4 pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-gray-700 font-medium fs-18">Images</span>
                        <div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            id="upload-images"
                            className="d-none"
                            onChange={e => setData('images', Array.from(e.target.files || []))}
                          />
                          <label htmlFor="upload-images" className="btn btn-outline-primary btn-sm m-0">
                            + Add New Images
                          </label>
                        </div>
                      </div>

                      {data.images.length > 0 && (
                        <div className="mb-3 text-success fs-14">
                          {data.images.length} new image(s) selected for upload.
                        </div>
                      )}
                      {errors.images && <div className="text-danger mb-2 fs-14">{errors.images}</div>}

                      <div className="d-flex flex-wrap gap-3">
                        {data.existing_images.length === 0 ? (
                          <span className="text-muted fs-14">No existing images.</span>
                        ) : (
                          data.existing_images.map((item: string, i: number) => (
                            <div key={i} className="position-relative" style={{ width: '120px', height: '120px' }}>
                              <img src={`/${item['image']}`} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                              <button type="button" onClick={() => {
                                let newArr = [...data.existing_images];
                                newArr.splice(i, 1);
                                setData('existing_images', newArr);
                              }} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', padding: 0 }}>
                                <i className="material-symbols-outlined fs-16">close</i>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={data.is_published}
                          onChange={e => setData('is_published', e.target.checked)}
                          className="form-check-input"
                          style={{ width: "20px", height: "20px", marginTop: "2px" }}
                        />
                        <span className="ml-2 ms-2">Published</span>
                      </label>
                    </div>

                    <div className="flex space-x-4 mt-4 pt-3 border-top">
                      <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary text-white px-4 py-2 rounded"
                      >
                        {processing ? 'Saving...' : 'Save Changes'}
                      </button>
                      <Link href="/admin/posts" className="btn btn-light ms-3">
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
