<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Credential;
use App\Models\Setting;
use App\Services\Backend\SystemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SystemSettingsController extends Controller
{
    protected $service;

    public function __construct(
        SystemService $service
    ) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $setting = Setting::first();

        if ($setting) {
            $setting = $this->service->first(
                $request,
                $setting->id
            );
        }

        return Inertia::render(
            'backend/settings/system',
            [
                'setting' => $setting,
            ]
        );
    }

    public function update(Request $request)
    {
        $this->service->update($request);

        return back()->with(
            'success',
            'System settings updated successfully.'
        );
    }


    public function smtp(Request $request)
    {
        $mailer = Credential::smtp('mailer');
        $host = Credential::smtp('host');
        $port = Credential::smtp('port');
        $username = Credential::smtp('username');
        $password = Credential::smtp('password');
        $encryption = Credential::smtp('encryption');
        $from_email = Credential::smtp('from_email');
        $from_name = Credential::smtp('from_name');

        return Inertia::render(
            'backend/settings/smtp',
            [
                "mailer"          => $mailer,
                "host"          => $host,
                "port"          => $port,
                "username"      => $username,
                "password"      => $password,
                "encryption"    => $encryption,
                "from_email"    => $from_email,
                "from_name"     => $from_name,
            ]
        );
    }

    public function updateSmtp(Request $request)
    {
        Credential::setValue('smtp', 'mailer', $request->mailer);
        Credential::setValue('smtp', 'host', $request->host);
        Credential::setValue('smtp', 'port', $request->port);
        Credential::setValue('smtp', 'username', $request->username);
        Credential::setValue('smtp', 'password', $request->password);
        Credential::setValue('smtp', 'encryption', $request->encryption);
        Credential::setValue('smtp', 'from_email', $request->from_email);
        Credential::setValue('smtp', 'from_name', $request->from_name);


        return back()->with('success', 'SMTP settings updated successfully.');
    }

    public function stripe(Request $request)
    {
        $publishableKey = Credential::getValue('stripe', 'publishable_key');
        $secretKey = Credential::getValue('stripe', 'secret_key');
        // $webhookSecret = Credential::getValue('stripe', 'webhook_secret');
        // $currency = Credential::getValue('stripe', 'currency', 'USD');
        // $status = Credential::getValue('stripe', 'status', '1');

        return Inertia::render(
            'backend/settings/stripe',
            [
                'publishable_key' => $publishableKey ?? env('STRIPE_PUBLISHABLE_KEY'),
                'secret_key'      => $secretKey ?? env('STRIPE_SECRET_KEY'),
                // 'webhook_secret'  => $webhookSecret,
                // 'currency'        => $currency,
                // 'status'          => $status,
            ]
        );
    }

    public function updateStripe(Request $request)
    {
        Credential::setValue('stripe', 'publishable_key', $request->publishable_key);
        Credential::setValue('stripe', 'secret_key', $request->secret_key);
        // Credential::setValue('stripe', 'currency', $request->currency);
        // Credential::setValue('stripe', 'status', $request->status);
        return back()->with('success', 'Stripe settings updated successfully.');
    }

    public function reelsAds(Request $request)
    {
        $conditionType = Credential::getValue('reels_ad', 'condition_type', 'disabled');
        $staticFrequency = Credential::getValue('reels_ad', 'static_frequency', '5');
        $randomMin = Credential::getValue('reels_ad', 'random_min', '3');
        $randomMax = Credential::getValue('reels_ad', 'random_max', '7');

        return Inertia::render('backend/settings/reels-ads', [
            'condition_type' => $conditionType,
            'static_frequency' => $staticFrequency,
            'random_min' => $randomMin,
            'random_max' => $randomMax,
        ]);
    }

    public function updateReelsAds(Request $request)
    {
        $request->validate([
            'condition_type' => 'required|in:disabled,static,random',
            'static_frequency' => 'nullable|integer|min:1',
            'random_min' => 'nullable|integer|min:1',
            'random_max' => 'nullable|integer|gt:random_min',
        ]);

        Credential::setValue('reels_ad', 'condition_type', $request->condition_type);
        Credential::setValue('reels_ad', 'static_frequency', $request->static_frequency);
        Credential::setValue('reels_ad', 'random_min', $request->random_min);
        Credential::setValue('reels_ad', 'random_max', $request->random_max);

        return back()->with('success', 'Reel Ads settings updated successfully.');
    }
}
