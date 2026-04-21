<?php

use App\Http\Controllers\admin\ProfileController;
use App\Http\Controllers\admin\CompanyGroupController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\InventoryController;
use App\Http\Controllers\admin\CompanyController;
use App\Http\Controllers\admin\PriceOptionController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\admin\AttributeController;
use App\Http\Controllers\admin\AdressController;
use App\Http\Controllers\admin\ContactController;
use App\Http\Controllers\admin\OrderController;
use App\Http\Controllers\admin\ServiceController;
use App\Http\Controllers\admin\RequestController;

use App\Http\Controllers\client\HomeController;
use App\Http\Controllers\client\ShopController;
use App\Http\Controllers\client\ClientContactController;
use App\Http\Controllers\client\ShowController;
use App\Http\Controllers\client\CartController;
use App\Http\Controllers\client\ClientServiceController;
use App\Http\Controllers\RequestController as ClientRequestController;

use App\Http\Controllers\AboutController;
use App\Http\Controllers\TestimonialController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::group([], function(){
    Route::get('/', [HomeController::class, 'index'])->name('home.index');
    Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
    Route::get('/search', [ShopController::class, 'search'])->name('search');
    Route::get('/menu', [ShopController::class, 'categories'])->name('shop.categories');
    Route::get('/menu/{url}', [ShopController::class, 'catprods'])->name('shop.catprods');
    Route::get('/occasion/{url}', [ShopController::class, 'eventprods'])->name('shop.eventprods');
    Route::get('/product/{url}', [ShowController::class, 'index'])->name('product.index');
    Route::get('/contact',[ClientContactController::class,"create"])->name('contact.create');
    Route::post('/contact',[ClientContactController::class,"store"]);
    Route::get('/checkout', [CartController::class, "checkout"])->name('checkout');
    Route::get('/services', [ClientServiceController::class, 'list'])->name('services.index');
    Route::get('/service/{url}', [ClientServiceController::class, 'show'])->name('service.show');
    Route::get('/about', [AboutController::class, 'index'])->name('about.index');
    Route::get('/order/{order}',[CartController::class,"orderDetails"])->name('order.details');
    Route::get('/service/request/{request}',[ClientRequestController::class,"requestDetails"])->name('request.details');
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::group([
        'prefix'=>'admin',
        'middleware' => ['auth', 'has.role:admin'],
        'as'=> 'admin.'
    ], function(){

        Route::get('/', [ProductController::class, 'index'])->name('dashboard');

        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::get('/clients/customers', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::get('/pending-users',[UserController::class,"hasPendingUser"])->name('users.pending');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/edit/{user}', [UserController::class, 'edit'])->name('users.edit');
        Route::post('/users/update/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.delete');
        Route::get('/clients/customers/validate/{user}', [UserController::class, 'validate_pended'])->name('users.validate');

        Route::get('/team/users', [UserController::class, 'admins'])->name('users.team');
        Route::get('/team/users/create', [UserController::class, 'create'])->name('users.team.create');
        Route::post('/team/users/store', [UserController::class, 'store'])->name('users.team.store');
        Route::get('/team/users/edit/{user}', [UserController::class, 'edit'])->name('users.team.edit');
        Route::put('/team/users/update/{user}', [UserController::class, 'update'])->name('users.team.update');

        Route::get('/contacts',[ContactController::class, 'index'])->name('contacts.index');
        Route::delete('/contacts/{contact}',[ContactController::class, 'destroy'])->name('contacts.delete');
        Route::delete('/contacts',[ContactController::class, 'destroyAll'])->name('contacts.deleteAll');

        Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
        Route::get('/services/create', [ServiceController::class, 'create'])->name('services.create');
        Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
        Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->name('services.delete');
        Route::get('/services/edit/{service}', [ServiceController::class, 'edit'])->name('services.edit');
        Route::post('/services/update/{service}', [ServiceController::class, 'update'])->name('services.update');

        Route::get('/requests', [RequestController::class, 'index'])->name('requests.index');
        Route::delete('/requests/{request}', [RequestController::class, 'destroy'])->name('requests.delete');
        Route::get('/requests/edit/{request}', [RequestController::class, 'edit'])->name('requests.edit');
        Route::post('/requests/update/{request}', [RequestController::class, 'update'])->name('requests.update');

        Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');
        Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->name('testimonials.destroy');
        Route::post('/testimonials/{testimonial}/toggle-approval', [TestimonialController::class, 'toggleApproval'])->name('testimonials.toggleApproval');

        Route::get('/about', [AboutController::class, 'create'])->name('about.create');
        //Route::get('/about/create', [AboutController::class, 'create'])->name('about.create');
        Route::post('/about', [AboutController::class, 'store'])->name('about.store');
        //Route::put('/about/update', [AboutController::class, 'update'])->name('about.update');

        Route::get('/ceo/create', [AboutController::class, 'createCeo'])->name('ceo.create');
        Route::post('/ceo', [AboutController::class, 'storeCeo'])->name('ceo.store');

        Route::get('/sales/orders/history',[OrderController::class, 'history'])->name('orders.history');

    });

    Route::group([
        'prefix'=>'admin',
        'middleware' => ['auth', 'has.role:admin,staff'],
        'as'=> 'admin.'
    ], function(){

        Route::get('/', [ProductController::class, 'index'])->name('dashboard');

        Route::get('/catalog/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::get('/catalog/categories/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::post('/catalog/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::get('/catalog/categories/edit/{category}', [CategoryController::class, 'edit'])->name('categories.edit');
        Route::post('/catalog/categories/update/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/catalog/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.delete');

        Route::get('/catalog/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/catalog/products/show/{product}', [ProductController::class, 'show'])->name('products.show');
        Route::get('/catalog/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/catalog/products', [ProductController::class, 'store'])->name('products.store');
        Route::get('/catalog/products/edit/{product}', [ProductController::class, 'edit'])->name('products.edit');
        Route::post('/catalog/products/update/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/catalog/products/{product}', [ProductController::class, 'destroy'])->name('products.delete');
        Route::get('/catalog/products/{product}/purchase', [CartController::class, 'addToCartForm'])->name('products.purchase');
        Route::post('/catalog/products/{product}/purchase', [CartController::class, 'addToCart'])->name('products.purchase.store');
        Route::post('/catalog/products/import', [ProductController::class, 'import'])->name('products.import');
        //Route::post('/catalog/products/import', [ProductController::class, 'importOptions'])->name('products.import');
        Route::get('/catalog/products/update-urls', [ProductController::class, 'updateUrls'])->name('products.updateurls');

    });

    Route::group([
        'prefix'=>'admin',
        'middleware' => ['auth', 'has.role:admin,staff,delivery'],
        'as'=> 'admin.'
    ], function(){
        Route::get('/sales/orders',[OrderController::class, 'index'])->name('orders.index');
    });

    Route::group([], function(){
        Route::post('/cart',[CartController::class,"addToCart"])->name('cart.store');
        Route::post('/cart/update',[CartController::class,"update"])->name('cart.update');
        Route::get('/cart',[CartController::class,"index"])->name('cart.index');
        Route::get('/getcart',[CartController::class,"getCart"])->name('cart.get');
        Route::delete('/cart',[CartController::class,"clearCart"])->name('cart.empty');
        Route::delete('/cart/{purchase}',[CartController::class,"removeFromCart"])->name('cart.delete');
        Route::get('/cart/order',[CartController::class,"order"])->name('cart.order');
        Route::post('/cart/checkout',[CartController::class,"checkout"])->name('cart.checkout');
        //Route::get('/orders/download/en/{order}',[CartController::class,"downloadPDF"])->name('cart.download1');
        //Route::get('/orders/download/ar/{order}',[CartController::class,"downloadPDF_ar"])->name('cart.download2');
        //Route::get('/orders',[CartController::class,"history"])->name('cart.checkout');
        //Route::get('/orders/download/{order}',[CartController::class,"downloadPDF"])->name('cart.download1');
        Route::get('/orders',[CartController::class,"history"])->name('orders.history');
        //Route::get('/product/price/{id}/{quantity}/{type}', [ShopController::class, "calculatePrice"])->name('product.price');

    })->middleware(['auth', 'verified']);

});

require __DIR__.'/auth.php';
