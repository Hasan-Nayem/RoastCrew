<?php

namespace App\Services\Reels;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MuxVideoService
{
    protected string $baseUrl = 'https://api.mux.com/video/v1';

    protected function client()
    {
        return Http::withBasicAuth(
            config('services.mux.token_id'),
            config('services.mux.token_secret')
        )->acceptJson();
    }

    /**
     * Upload video to Mux.
     *
     * @throws Exception
     */
    public function upload(UploadedFile $video): array
    {
        /**
         * Create Direct Upload
         */
        $response = $this->client()->post("{$this->baseUrl}/uploads", [
            'cors_origin' => '*',
            'new_asset_settings' => [
                'playback_policy' => ['public'],
            ],
        ]);

        if (!$response->successful()) {
            throw new Exception($response->body());
        }

        $upload = $response->json('data');

        /**
         * Upload binary to Mux
         */
        $uploadResponse = Http::withBody(
            fopen($video->getRealPath(), 'r'),
            $video->getMimeType()
        )->put($upload['url']);

        if (!$uploadResponse->successful()) {
            throw new Exception('Video upload failed.');
        }

        /**
         * Wait until Mux creates an asset
         */
        $assetId = null;

        for ($i = 0; $i < 20; $i++) {

            sleep(2);

            $status = $this->client()
                ->get("{$this->baseUrl}/uploads/{$upload['id']}")
                ->json('data');

            if (!empty($status['asset_id'])) {
                $assetId = $status['asset_id'];
                break;
            }
        }

        if (!$assetId) {
            throw new Exception('Mux did not create an asset.');
        }

        return $this->getUpload($assetId);
    }

    /**
     * Get asset details.
     */
    public function getUpload(string $assetId): array
    {
        $response = $this->client()
            ->get("{$this->baseUrl}/assets/{$assetId}");

        if (!$response->successful()) {
            throw new Exception($response->body());
        }

        $asset = $response->json('data');

        $playbackId = $asset['playback_ids'][0]['id'] ?? null;

        return [
            'asset_id' => $asset['id'],
            'status' => $asset['status'],
            'duration' => $asset['duration'] ?? null,
            'aspect_ratio' => $asset['aspect_ratio'] ?? null,
            'playback_id' => $playbackId,
            'video_url' => $playbackId
                ? "https://stream.mux.com/{$playbackId}.m3u8"
                : null,
            'thumbnail' => $playbackId
                ? "https://image.mux.com/{$playbackId}/thumbnail.jpg"
                : null,
            'gif' => $playbackId
                ? "https://image.mux.com/{$playbackId}/animated.gif"
                : null,
        ];
    }

    /**
     * Delete Mux Asset.
     *
     * @throws Exception
     */
    public function delete(string $assetId): bool
    {
        $response = $this->client()->delete("{$this->baseUrl}/assets/{$assetId}");

        if (! $response->successful()) {
            throw new Exception($response->body());
        }

        return true;
    }
}
