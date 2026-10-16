<?php

namespace App\Http\Controllers\API\Reels;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reels\StoreReelCommentRequest;
use App\Http\Requests\Reels\StoreReelRequest;
use App\Http\Requests\Reels\UpdateReelRequest;
use App\Http\Resources\Reels\ReelCommentResource;
use App\Http\Resources\Reels\ReelResource;
use App\Services\API\ReelsServices;
use App\Services\Reels\MuxVideoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReelsApiController extends Controller
{
    use ApiResponse;

    protected ReelsServices $reelsService;

    public function __construct(ReelsServices $reelsService)
    {
        $this->reelsService = $reelsService;
    }




    public function chunkUpload(Request $request)
    {
        $request->validate([
            'chunk'        => 'required|file',
            'chunk_index'  => 'required|integer|min:0',
            'total_chunks' => 'required|integer|min:1',
            'upload_id'    => 'required|string',
            'filename'     => 'required|string',
        ]);

        $uploadId = $request->upload_id;
        $chunkIndex = (int) $request->chunk_index;
        $totalChunks = (int) $request->total_chunks;
        $filename = $request->filename;

        // Store chunks in storage/app/chunks/{upload_id}
        $chunkDir = storage_path("app/chunks/{$uploadId}");

        if (!File::exists($chunkDir)) {
            File::makeDirectory($chunkDir, 0755, true);
        }

        // Save current chunk
        $request->file('chunk')->move($chunkDir, "{$chunkIndex}.part");

        // Verify that every chunk exists
        $allChunksUploaded = true;

        for ($i = 0; $i < $totalChunks; $i++) {
            if (!File::exists($chunkDir . "/{$i}.part")) {
                $allChunksUploaded = false;
                break;
            }
        }

        if (!$allChunksUploaded) {
            return response()->json([
                'success' => true,
                'completed' => false,
                'uploaded_chunk' => $chunkIndex,
            ]);
        }

        // Create uploads directory
        Storage::disk('public')->makeDirectory('uploads');

        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $finalName = Str::uuid() . ($extension ? '.' . $extension : '');

        $finalPath = storage_path("app/public/uploads/{$finalName}");

        try {

            $output = fopen($finalPath, 'wb');

            if (!$output) {
                throw new \Exception('Unable to create output file.');
            }

            // Merge chunks
            for ($i = 0; $i < $totalChunks; $i++) {

                $chunkPath = $chunkDir . "/{$i}.part";

                $input = fopen($chunkPath, 'rb');

                if (!$input) {
                    throw new \Exception("Unable to read chunk {$i}.");
                }

                while (!feof($input)) {
                    fwrite($output, fread($input, 1024 * 1024));
                }

                fclose($input);

                File::delete($chunkPath);
            }

            fclose($output);

            File::deleteDirectory($chunkDir);

            // Save to database if needed
            // $video = Reel::create([
            //     'video' => 'uploads/' . $finalName,
            // ]);

            return response()->json([
                'success' => true,
                'completed' => true,
                'file_name' => $finalName,
                'file_url' => asset("storage/uploads/{$finalName}"),
            ]);
        } catch (\Exception $e) {

            if (isset($output) && is_resource($output)) {
                fclose($output);
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $data = $this->reelsService->list($request->all());
        return $this->successResponse(
            'Reels fetched successfully.',
            ReelResource::collection($data)
        );
    }


    public function mylist(Request $request)
    {
        $data = $this->reelsService->mylist($request->all());

        $data->setCollection(
            $data->getCollection()->map(function ($reel) use ($request) {
                return (new ReelResource($reel))->toArray($request);
            })
        );

        return $this->successResponse(
            'Reels fetched successfully.',
            $data
        );
    }


    public function store(StoreReelRequest $request)
    {
        $reel = $this->reelsService->store($request);

        return $this->successResponse('Reel created successfully.', new ReelResource($reel), 201);
    }

    public function show($id)
    {
        $reel = $this->reelsService->show($id);

        if (!$reel) {
            return $this->errorResponse('Reel not found.', 404);
        }

        return $this->successResponse('Reel fetched successfully.', new ReelResource($reel));
    }

    public function update(UpdateReelRequest $request, $id)
    {
        $reel = $this->reelsService->update($id, $request);

        if (!$reel) {
            return $this->errorResponse('Reel not found.', 404);
        }

        return $this->successResponse('Reel updated successfully.', new ReelResource($reel));
    }

    public function updateComment(Request $request, $reelId, $commentId)
    {
        $data = $this->reelsService->updateComment($request, $reelId, $commentId);

        if (is_null($data)) {
            return $this->errorResponse('Comment not found.', 404);
        }
        return $this->successResponse('Comment updated successfully.', $data);
    }

    public function delete($id)
    {
        $deleted = $this->reelsService->delete($id);

        if (!$deleted) {
            return $this->errorResponse('Reel not found.', 404);
        }

        return $this->successResponse('Reel deleted successfully.');
    }

    /**
     * Toggle like on a reel (like / unlike).
     */
    public function toggleLike($id)
    {
        $result = $this->reelsService->toggleLike($id);

        if ($result === null) {
            return $this->errorResponse('Reel not found.', 404);
        }

        $message = $result['liked'] ? 'Reel liked.' : 'Reel unliked.';
        return $this->successResponse($message, $result);
    }

    /**
     * Add a comment to a reel.
     */
    public function addComment(StoreReelCommentRequest $request, $id)
    {
        $comment = $this->reelsService->addComment($id, $request->validated());

        if (!$comment) {
            return $this->errorResponse('Reel not found.', 404);
        }

        return $this->successResponse('Comment added.', new ReelCommentResource($comment), 201);
    }

    /**
     * Get all comments for a reel.
     */
    public function comments($id)
    {
        $comments = $this->reelsService->getComments($id);

        if ($comments === null) {
            return $this->errorResponse('Reel not found.', 404);
        }

        return $this->successResponse('Comments fetched successfully.', ReelCommentResource::collection($comments));
    }

    /**
     * Delete a comment from a reel.
     */
    public function deleteComment($reelId, $commentId)
    {
        $deleted = $this->reelsService->deleteComment($reelId, $commentId);

        if (!$deleted) {
            return $this->errorResponse('Comment not found or unauthorized.', 404);
        }

        return $this->successResponse('Comment deleted.');
    }

    /**
     * Increment the view count of a reel.
     */
    public function incrementView($id)
    {
        $reel = $this->reelsService->incrementView($id);

        if (!$reel) {
            return $this->errorResponse('Reel not found.', 404);
        }

        return $this->successResponse('View recorded.', ['views' => $reel->views]);
    }

    /**
     * Increment the share count of a reel.
     */
    public function share($id)
    {
        $reel = $this->reelsService->incrementShare($id);

        if (!$reel) {
            return $this->errorResponse('Reel not found.', 404);
        }

        return $this->successResponse('Share recorded.', ['shares' => $reel->shares]);
    }
}
