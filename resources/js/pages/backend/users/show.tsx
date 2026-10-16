import MainLayout from "@/layouts/main-layout";

import { Link } from "@inertiajs/react";

interface Props {
    user: any;
}

export default function Show({
    user,
}: Props) {

    const avatar =
        user.avatar &&
            user.avatar !== "null"
            ? `/${user.avatar}`
            : "/backend/assets/images/placholder.png";

    return (
        <div className="row">

            {/* Profile Card */}
            <div className="col-lg-4">




                <div className="card bg-white p-20 rounded-10 border border-white mb-4">

                    <div className="text-center" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}>

                        <img
                            src={avatar}
                            alt={user.name}
                            className="rounded-circle mb-3 border border-1 d-flex justify-content-center align-items-center"
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                            }}
                        />

                        <h3 className="mb-1">
                            {user.first_name} {user.last_name}
                        </h3>

                        <p className="text-muted mb-3">
                            {user.email}
                        </p>

                        <span className="badge bg-primary text-capitalize fs-14">
                            {user.role ?? "user"}
                        </span>

                    </div>

                </div>

            </div>

            {/* Details */}
            <div className="col-lg-8">

                <div className="card bg-white p-20 rounded-10 border border-white mb-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h3 className="mb-0">
                            User Information
                        </h3>

                        <div className="d-flex gap-2">
                            <Link
                                href={`/admin/users/` + user.id + `/sessions`}
                                className="btn btn-info fs-16 fw-normal text-white"
                            >
                                Sessions
                            </Link>

                            <Link
                                href={`/admin/user/edit/${user.id}`}
                                className="btn btn-primary text-white"
                            >
                                Edit
                            </Link>

                            <Link
                                href="/admin/users"
                                className="btn btn-secondary"
                            >
                                Back
                            </Link>

                        </div>

                    </div>

                    <div className="row">

                        {/* First Name */}
                        <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">First Name</label>
                            <div className="form-control bg-light">{user.first_name ?? "N/A"}</div>
                        </div>

                        {/* Last Name */}
                        <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Last Name</label>
                            <div className="form-control bg-light">{user.last_name ?? "N/A"}</div>
                        </div>

                        {/* Username */}
                        {/* <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Username</label>
                            <div className="form-control bg-light">{user.user_name ?? "N/A"}</div>
                        </div> */}

                        {/* Email */}
                        <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Email Address</label>
                            <div className="form-control bg-light">{user.email}</div>
                        </div>

                        {/* Phone */}
                        {/* <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Phone</label>
                            <div className="form-control bg-light">{user.phone ?? "N/A"}</div>
                        </div> */}

                        {/* Date of Birth */}
                        {/* <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Date of Birth</label>
                            <div className="form-control bg-light">
                                {user.date_of_birth ?? "N/A"}
                            </div>
                        </div> */}

                        {/* Gender */}
                        <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Gender</label>
                            <div className="form-control bg-light text-capitalize">
                                {user.gender ?? "N/A"}
                            </div>
                        </div>

                        {/* City */}
                        {/* <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">City</label>
                            <div className="form-control bg-light">{user.city ?? "N/A"}</div>
                        </div> */}

                        {/* State */}
                        {/* <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">State</label>
                            <div className="form-control bg-light">{user.state ?? "N/A"}</div>
                        </div> */}

                        {/* Address */}
                        {/* <div className="col-md-12 mb-4">
                            <label className="label fs-14 text-muted mb-2">Address</label>
                            <div className="form-control bg-light">
                                {user.address ?? "N/A"}
                            </div>
                        </div> */}

                        {/* Bio */}
                        {/* <div className="col-md-12 mb-4">
                            <label className="label fs-14 text-muted mb-2">Bio</label>
                            <div
                                className="form-control bg-light"
                                style={{ minHeight: "100px" }}
                            >
                                {user.bio ?? "N/A"}
                            </div>
                        </div> */}

                        {/* Role */}
                        <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Role</label>
                            <div>
                                <span className="badge bg-secondary text-capitalize">
                                    {user.role ?? "user"}
                                </span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Status</label>
                            <div>
                                <span
                                    className={`badge text-capitalize ${user.status === "active"
                                            ? "bg-success"
                                            : user.status === "inactive"
                                                ? "bg-warning text-dark"
                                                : "bg-danger"
                                        }`}
                                >
                                    {user.status ?? "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Email Verified */}
                        <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Email Verified</label>
                            <div>
                                <span
                                    className={`badge ${user.email_verified_at
                                            ? "bg-success"
                                            : "bg-danger"
                                        }`}
                                >
                                    {user.email_verified_at ? "Verified" : "Not Verified"}
                                </span>
                            </div>
                        </div>

                        {/* Provider */}
                        {/* <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Provider ID</label>
                            <div className="form-control bg-light">
                                {user.provider_id ?? "N/A"}
                            </div>
                        </div> */}

                        {/* Joined At */}
                        <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Joined At</label>
                            <div className="form-control bg-light">
                                {user.created_at
                                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "N/A"}
                            </div>
                        </div>

                        {/* Last Updated */}
                        {/* <div className="col-md-6 mb-4">
                            <label className="label fs-14 text-muted mb-2">Last Updated</label>
                            <div className="form-control bg-light">
                                {user.updated_at
                                    ? new Date(user.updated_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "N/A"}
                            </div>
                        </div> */}

                        {/* Email Notifications */}
                        <div className="col-md-4 mb-3">
                            <label className="label fs-14 text-muted mb-2">Email Notifications</label>
                            <div className="form-control bg-light">
                                {user.email_notifications ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        {/* Push Notifications */}
                        <div className="col-md-4 mb-3">
                            <label className="label fs-14 text-muted mb-2">Push Notifications</label>
                            <div className="form-control bg-light">
                                {user.push_notifications ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        {/* SMS Notifications */}
                        <div className="col-md-4 mb-3">
                            <label className="label fs-14 text-muted mb-2">SMS Notifications</label>
                            <div className="form-control bg-light">
                                {user.sms_notifications ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        {/* Match Notifications */}
                        <div className="col-md-4 mb-3">
                            <label className="label fs-14 text-muted mb-2">Match Notifications</label>
                            <div className="form-control bg-light">
                                {user.match_notifications ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        {/* Message Notifications */}
                        <div className="col-md-4 mb-3">
                            <label className="label fs-14 text-muted mb-2">Message Notifications</label>
                            <div className="form-control bg-light">
                                {user.message_notifications ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        {/* Like Notifications */}
                        <div className="col-md-4 mb-3">
                            <label className="label fs-14 text-muted mb-2">Like Notifications</label>
                            <div className="form-control bg-light">
                                {user.like_notifications ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        {/* Marketing Notifications */}
                        <div className="col-md-4 mb-3">
                            <label className="label fs-14 text-muted mb-2">Marketing Notifications</label>
                            <div className="form-control bg-light">
                                {user.marketing_notifications ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}