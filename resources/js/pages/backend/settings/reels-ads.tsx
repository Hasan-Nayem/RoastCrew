import { Head, useForm, router } from "@inertiajs/react";
import React from "react";

interface Props {
    condition_type: string;
    static_frequency: string;
    random_min: string;
    random_max: string;
}

export default function ReelsAdsSettings({ condition_type, static_frequency, random_min, random_max }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        condition_type: condition_type || "disabled",
        static_frequency: static_frequency || "5",
        random_min: random_min || "3",
        random_max: random_max || "7",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/settings/reels-ads/update");
    };

    const conditions = [
        {
            value: "disabled",
            label: "Disabled",
            icon: "block",
            description:
                "No ads will appear in the Reels feed. The API will return only standard reels with `\"type\": \"reel\"` for all items.",
        },
        {
            value: "static",
            label: "Static Frequency",
            icon: "repeat",
            description:
                "An ad is injected at a fixed interval you define. For example, setting the frequency to 5 means an ad appears after every 5 reels. This is predictable and consistent. The API will mix items with `\"type\": \"reel\"` and `\"type\": \"ad\"` at the specified position.",
        },
        {
            value: "random",
            label: "Random Frequency",
            icon: "shuffle",
            description:
                "An ad is injected at a random position between a minimum and maximum value you define. For example, setting Min to 3 and Max to 7 means an ad will appear somewhere after every 3–7 reels, making the experience feel more organic and less predictable to the user.",
        },
    ];

    return (
        <>
            <Head title="Reel Ads Settings" />

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 mt-1">
                <div>
                    <h3 className="mb-0">Reel Ads Settings</h3>
                    <p className="fs-16">Configure how and when ads appear between reels in the mobile feed.</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white border border-white rounded-10 p-20 mb-4">
                        <h4 className="fs-18 mb-1">Injection Condition</h4>
                        <p className="text-muted fs-14 mb-4">
                            Select when an ad is injected into the Reels list. The API returns each item with a <code>type</code> field — either <code>"reel"</code> or <code>"ad"</code> — so the app knows which UI to render.
                        </p>

                        <form onSubmit={submit}>
                            <div className="mb-4">
                                {conditions.map((cond) => (
                                    <div
                                        key={cond.value}
                                        className={`p-3 mb-3 rounded border cursor-pointer ${data.condition_type === cond.value ? "border-primary bg-primary bg-opacity-10" : "border-light"}`}
                                        onClick={() => setData("condition_type", cond.value)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="d-flex align-items-start gap-3">
                                            <input
                                                type="radio"
                                                className="form-check-input mt-1"
                                                checked={data.condition_type === cond.value}
                                                onChange={() => setData("condition_type", cond.value)}
                                                style={{ flexShrink: 0 }}
                                            />
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <span className="material-symbols-outlined fs-18 text-primary">{cond.icon}</span>
                                                    <strong className="fs-15">{cond.label}</strong>
                                                </div>
                                                <p className="text-muted fs-13 mb-0">{cond.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {errors.condition_type && <div className="text-danger mt-1">{errors.condition_type}</div>}
                            </div>

                            {/* Static Frequency options */}
                            {data.condition_type === "static" && (
                                <div className="card border rounded p-3 mb-4">
                                    <h5 className="fs-15 mb-1">Static Frequency Options</h5>
                                    <p className="text-muted fs-13 mb-3">An ad will appear exactly every <strong>N</strong> reels.</p>
                                    <div className="mb-0">
                                        <label className="label fs-15 mb-1">Show an ad every</label>
                                        <div className="input-group" style={{ maxWidth: "200px" }}>
                                            <input
                                                type="number"
                                                min={1}
                                                className="form-control"
                                                value={data.static_frequency}
                                                onChange={(e) => setData("static_frequency", e.target.value)}
                                            />
                                            <span className="input-group-text">reels</span>
                                        </div>
                                        {errors.static_frequency && <div className="text-danger mt-1">{errors.static_frequency}</div>}
                                    </div>
                                </div>
                            )}

                            {/* Random Frequency options */}
                            {data.condition_type === "random" && (
                                <div className="card border rounded p-3 mb-4">
                                    <h5 className="fs-15 mb-1">Random Frequency Options</h5>
                                    <p className="text-muted fs-13 mb-3">An ad will appear at a random position, somewhere between <strong>Min</strong> and <strong>Max</strong> reels.</p>
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <label className="label fs-15 mb-1">Minimum (reels)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                className="form-control"
                                                value={data.random_min}
                                                onChange={(e) => setData("random_min", e.target.value)}
                                            />
                                            {errors.random_min && <div className="text-danger mt-1">{errors.random_min}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="label fs-15 mb-1">Maximum (reels)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                className="form-control"
                                                value={data.random_max}
                                                onChange={(e) => setData("random_max", e.target.value)}
                                            />
                                            {errors.random_max && <div className="text-danger mt-1">{errors.random_max}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                Save Settings
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card bg-white border border-white rounded-10 p-20 mb-4">
                        <h5 className="fs-15 mb-3">
                            <span className="material-symbols-outlined fs-18 align-middle me-1 text-info">info</span>
                            How it works
                        </h5>
                        <ul className="ps-3 text-muted fs-13" style={{ lineHeight: "2" }}>
                            <li>The Reels API returns a flat list of items.</li>
                            <li>Each item has a <code>type</code> field: <code>"reel"</code> or <code>"ad"</code>.</li>
                            <li>The mobile app checks <code>item.type</code> to decide which component to render.</li>
                            <li>Only <strong>active</strong> ads are eligible to be injected.</li>
                            <li>When multiple ads exist, a random active one is selected for each injection slot.</li>
                        </ul>

                        <hr />

                        <h5 className="fs-15 mb-2">Example Response</h5>
                        <pre className="bg-light p-2 rounded fs-12 mb-0" style={{ overflowX: "auto" }}>
                            {`
    [
        { "id": 1, "type": "reel", ... },
        { "id": 2, "type": "reel", ... },
        { "id": 5, "type": "ad", ... },
        { "id": 3, "type": "reel", ... },
    ]
                            `}
                        </pre>
                    </div>
                </div>
            </div>
        </>
    );
}
