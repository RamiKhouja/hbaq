<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\client\ClientServiceController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\admin\ContactController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/services', [ClientServiceController::class, 'jsonIndex']);
Route::put('/admin/requests/read', [RequestController::class, 'markAllAsRead']);
Route::get('/admin/requests/unread', [RequestController::class, 'unread']);
Route::apiResource('requests', RequestController::class);
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::post('/profiles', [ProfileController::class, 'store']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/payment-response/{order}', [OrderController::class, 'update']);
Route::get('/orders/{id}/role/{role}', [OrderController::class, 'list']);
Route::get('/orders/paginated', [OrderController::class, 'paginate']);
Route::put('/orders/change/{order}', [OrderController::class, 'change']);
Route::get('/request-payment-response/{request}', [RequestController::class, 'paymentUpdate']);
Route::get('/contact/unread', [ContactController::class, 'unread']);
Route::put('/contact/read', [ContactController::class, 'read']);
