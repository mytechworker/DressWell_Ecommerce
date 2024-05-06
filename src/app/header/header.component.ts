import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Product, UserDocument } from '../product';
import { BehaviorSubject, Observable, map, of, startWith, switchMap } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CartService } from '../services/cart.service';
import { FirebaseService } from '../services/firebase.service';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/authenticate.service';

const getObservable = (collection: AngularFirestoreCollection<Product>) => {
  const subject = new BehaviorSubject<Product[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Product[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean;
  configData: any;
  isSortMenuVisible: boolean;
  datasource: any;
  currentUser: UserDocument | null = null;
  @Input() helpType: string;
  @Input() isLogout = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalItems: number;
  totalNotifications: number;
  product = getObservable(this.store.collection('product')) as Observable<
    Product[]
  >;
  dataSource = new MatTableDataSource<Product>([]);
  searchControl = new FormControl();
  searchInput: string = '';
  filteredProducts: Observable<Product[]>;
  filteredProductsArrayValue: Product[] = [];
  showSearchOptions: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private cartService: CartService,
    private afAuth: AngularFireAuth,
    private store: AngularFirestore,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  logout() {
    this.firebaseService.logout();
    this.isLogout.emit();
    this.router.navigate(['']);
  }

  logo() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isSignedIn;
        this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.firebaseService.getUserById(user.uid).subscribe((userData) => {
          this.currentUser = userData as UserDocument;
          this.notificationService.count$.subscribe((count) => {
            this.totalNotifications = count;
          });
        });
      } else {
        this.isAuthenticated = false;
      }
    });
    this.configData = this.firebaseService.getConfig();
    this.cartService.cartItems$.subscribe(() => {
      this.totalItems = this.cartService.getTotalItems();
    });
    this.product.subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filteredProducts = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filterProducts(name) : this.dataSource.data.slice()
        )
      );
    });
    this.filteredProducts = this.product.pipe(
      switchMap((products) => {
        const filterValue = this.searchInput.toLowerCase();
        return of(
          products.filter((product) =>
            product.name.toLowerCase().includes(filterValue)
          )
        );
      })
    );
      }

  private _filterProducts(name: string): Product[] {
    const filterValue = name.toLowerCase();
    return this.dataSource.data.filter((product) =>
      product.name.toLowerCase().includes(filterValue)
    );
  }

  displayProduct(product?: Product): string | undefined {
    return product ? product.name : undefined;
  }

  applyFilter(event: Event) {
    this.searchInput = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filteredProducts = this.filterProducts(this.searchInput);
  }

  public filterProducts(filterValue: string): Observable<Product[]> {
    return this.product.pipe(
      map((products) => {
        const filteredProducts = products.filter((product) =>
          product.name.toLowerCase().includes(filterValue)
        );
        this.filteredProductsArrayValue = filteredProducts;
        return filteredProducts;
      })
    );
  }

  selectProduct(product: Product) {
    const productId = product.id;
    this.router.navigate(['/product-details', productId]);
    this.searchControl.setValue('');
  }

  public filteredProductsArray(): Product[] {
    return this.filteredProductsArrayValue || [];
  }

  closeMenu(): void {}

  viewProfile() {}
}