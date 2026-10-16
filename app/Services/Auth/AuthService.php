<?php

namespace App\Services\Auth;

use App\Concerns\ApiResponse;
use App\Mail\ForgetPassword;
use App\Mail\VerifyRegister;
use App\Mail\WelcomeMail;
use App\Models\User;
use App\Repositories\Auth\AuthRepository;
use Ichtrojan\Otp\Otp;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    use ApiResponse;

    public function __construct(
        protected AuthRepository $repository
    ) {}

    public function register(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        $exists = $this->repository->findByEmail($data['email']);

        if ($exists) {
            if ($exists->email_verified_at != null) {
                // throw new \Exception('Email already verified');
                return false;
            }
            $otp = (new Otp)->generate($data['email'], 'numeric', 4, 15);
            Mail::to($data['email'])->send(new VerifyRegister($exists, $otp->token));
            return [
                'token' => $otp->token,
                'user' => $exists,
            ];
        }


        if (!empty($data['avatar'])) {
            $data = $this->repository->uploadAvatar($data);
        }

        $firstName = $data['first_name'] ?? '';
        $lastName  = $data['last_name'] ?? '';

        if (empty($firstName) && empty($lastName)) {
            $base = Str::slug(explode('@', $data['email'])[0] ?? 'user', '');
        } else {
            $base = Str::slug($firstName . $lastName, '');
        }

        do {
            $userName = $base . rand(1000, 9999);
        } while (User::where('user_name', $userName)->exists());

        $data['user_name'] = $userName;

        // dd($data);

        $user = $this->repository->createUser($data);
        $otp = (new Otp)->generate($data['email'], 'numeric', 4, 15);
        return [
            'token' => $otp->token,
            'user' => $user,
        ];
    }

    public function verifyEmail(array $data): array
    {
        $user = $this->repository->findByEmail($data['email']);

        if (!$user) {
            throw new \Exception('User not found');
        }

        if (!$user->email_verified_at) {
            $user->update([
                'email_verified_at' => now(),
            ]);
        }

        Mail::to($user->email)->send(new WelcomeMail($user->name));


        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'token' => $token,
            'user'  => $user->fresh(),
        ];
    }

    public function resendRegisterOtp(string $email): array|bool|null
    {
        $user = $this->repository->findByEmail($email);

        if (!$user) {
            return null;
        }

        if ($user->email_verified_at != null) {
            return false;
        }

        $otp = (new Otp)->generate($email, 'numeric', 4, 15);
        Mail::to($email)->send(new VerifyRegister($user, $otp->token));

        return [
            'token' => $otp->token,
            'user' => $user,
        ];
    }

    public function login(array $credentials)
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.']
            ]);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (is_null($user->email_verified_at)) {
            return false;
        }

        if ($user->status === 'suspend') {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => ['Your account has been suspended.']
            ]);
        }

        if ($user->status === 'inactive') {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => ['Your account is inactive. Please contact support.']
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
        ];
    }

    public function forgotPassword(string $email): string|bool
    {

        $user = $this->repository->findByEmail($email);

        if (!$user) {
            // throw new \Exception('User not found');
            return false;
        }
        $otp = (new Otp)->generate($email, 'numeric', 4, 15);
        Mail::to($email)->send(new ForgetPassword($user, $otp->token));

        return $otp->token;
    }

    public function resendForgotOtp(string $email): string|bool
    {
        $user = $this->repository->findByEmail($email);

        if (!$user) {
            return false;
        }

        $otp = (new Otp)->generate($email, 'numeric', 4, 15);
        Mail::to($email)->send(new ForgetPassword($user, $otp->token));

        return $otp->token;
    }


    public function verifyForgetPass(array $data): array
    {
        $user = $this->repository->findByEmail($data['email']);

        if (!$user) {
            throw new \Exception('User not found');
        }

        // Generate password reset token
        $resetToken = Password::createToken($user);


        if ($user) {
            $user->update([
                'remember_token' => $resetToken,
            ]);
        }

        return [
            'reset_token' => $resetToken,
            'user'  => $user->fresh(),
        ];
    }


    public function resetPassword(array $data): string
    {
        return Password::reset(
            $data,
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );
    }

    public function update(User $user, array $data)
    {
        if (!empty($data['avatar'])) {

            $oldAvatar = $user->getRawOriginal('avatar');

            if (
                $oldAvatar &&
                Storage::disk('public')->exists(
                    str_replace('storage/', '', $oldAvatar)
                )
            ) {
                Storage::disk('public')->delete(
                    str_replace('storage/', '', $oldAvatar)
                );
            }

            $data = $this->repository->uploadAvatar($data);
        } else {
            unset($data['avatar']);
        }

        if (
            isset($data['email']) &&
            $user->email !== $data['email']
        ) {
            $data['email_verified_at'] = null;
        }

        $user = $this->repository->update($user, $data);

        return $this->successResponse(
            'Profile updated successfully',
            $user
        );
    }

    public function delete(User $user)
    {
        $avatar = $user->getRawOriginal('avatar');

        if (
            $avatar &&
            Storage::disk('public')->exists(
                str_replace('storage/', '', $avatar)
            )
        ) {
            Storage::disk('public')->delete(
                str_replace('storage/', '', $avatar)
            );
        }

        $this->repository->delete($user);

        return $this->successResponse(
            'Account deleted successfully'
        );
    }
}
