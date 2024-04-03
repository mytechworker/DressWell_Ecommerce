import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialComponentsModule } from './material-component.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { HomeStartComponent } from './home-start/home-start.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { ProductHomeComponent } from './product-home/product-home.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './admin/components/users/users.component';
import { UserAddComponent } from './admin/components/users/user-add/user-add.component';
import { ProductOrdersComponent } from './admin/components/product-orders/product-orders.component';
import { OrdersDeclineComponent } from './admin/components/product-orders/orders-decline/orders-decline.component';
import { OrdersAcceptedComponent } from './admin/components/product-orders/orders-accepted/orders-accepted.component';
import { AdminSubCategoryComponent } from './admin/components/admin-subcategory/admin-subcategory.component';
import { SubcategoryDetailsComponent } from './admin/components/admin-subcategory/subcategory-details/subcategory-details.component';
import { AdminProductComponent } from './admin/components/admin-product/admin-product.component';
import { CategoryProductComponent } from './admin/components/admin-category/category-main/category-product.component';
import { CategoryDetailsComponent } from './admin/components/admin-category/category-details/category-details.component';
import { HomeDialogComponent } from './home-dialog/home-dialog.component';
import { BuyProductComponent } from './buy-product/buy-product.component';
import { OrdersComponent } from './buy-product/orders/orders.component';
import { MiniOrdersComponent } from './buy-product/orders/mini-orders/mini-orders.component';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AddressComponent } from './auth/address/address.component';
import { AddressHomeComponent } from './auth/address-home/address-home.component';
import { AddressAddsComponent } from './auth/address-adds/address-adds.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { CartService } from './services/cart.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationComponent } from './notification/notification.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { WishlistComponent } from './user-orders/wishlist/wishlist.component';
import { AuthService } from './services/authenticate.service';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MensClothingComponent } from './mens-clothing/mens-clothing.component';
import { WomenClothingComponent } from './women-clothing/women-clothing.component';
import { KidsClothingComponent } from './kids-clothing/kids-clothing.component';
import { PaymentComponent } from './payment/payment.component';
import { NgxStripeModule } from 'ngx-stripe';
import { ReadNotificationComponent } from './read-notification/read-notification.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    HomeStartComponent,
    ProductComponent,
    ProductDetailsComponent,
    ProductHomeComponent,
    AdminComponent,
    UsersComponent,
    UserAddComponent,
    ProductOrdersComponent,
    OrdersDeclineComponent,
    OrdersAcceptedComponent,
    AdminSubCategoryComponent,
    SubcategoryDetailsComponent,
    AdminProductComponent,
    CategoryProductComponent,
    CategoryDetailsComponent,
    HomeDialogComponent,
    ProductOrdersComponent,
    BuyProductComponent,
    OrdersComponent,
    MiniOrdersComponent,
    AuthComponent,
    ForgotPasswordComponent,
    AddressComponent,
    AddressHomeComponent,
    AddressAddsComponent,
    NotificationComponent,
    CartComponent,
    ProfileComponent,
    EditProfileComponent,
    UserOrdersComponent,
    WishlistComponent,
    MensClothingComponent,
    WomenClothingComponent,
    KidsClothingComponent,
    PaymentComponent,
    ReadNotificationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      appId : environment.NG_APP_ID,
      apiKey : environment.NG_APP_KEY,
      authDomain : environment.NG_APP_AUTH_DOMAIN,
      projectId:environment.NG_APP_PROJECT_ID,
      storageBucket:environment.NG_APP_STORAGE_BUCKET,
      messagingSenderId:environment.NG_APP_MESSAGING_SENDER_ID,
      measurementId:environment.NG_APP_MEASUREMENT_ID
    }),
    AngularFirestoreModule,
    AdminRoutingModule,
    MaterialComponentsModule,
    NgxImageZoomModule,
    SimpleNotificationsModule.forRoot(),
    NgxStripeModule.forRoot(
      'pk_test_51OUQ2YSBsRjMaYOe1phMU8RuXK3UsacqVQ9wdcdl8w53r3DXxHMkMZoFIqKH9lqiitvrqttRjfifDiBnXrc4C2eh00jlSA8Rl3'
    ),
  ],
  providers: [provideAnimationsAsync(), CartService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
