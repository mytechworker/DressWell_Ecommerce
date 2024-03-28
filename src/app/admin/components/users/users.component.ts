import { Component, ViewChild } from '@angular/core';
import { UserAddComponent, UserData, UserResult} from './user-add/user-add.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Address, UserDocument } from '../../../product';
import { FirebaseService } from '../../../services/firebase.service';
import { LocalStorageService } from '../../../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  users: UserDocument[] = [];
  currentUser: UserDocument | null = null;
  isToggleOn: boolean;
  current = 1;
  constructor(
    private firebaseService: FirebaseService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) {
    this.isToggleOn =
      JSON.parse(this.localStorageService.getItem('toggleState')) || false;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<UserDocument>([]);
  addresses: { [userId: string]: Address[] } = {};

  ngOnInit() {
    this.firebaseService.getAllUsernames().subscribe(
      (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        const userIds = users.map((user) => user.userId);
        this.firebaseService.getAddressByIds(userIds).subscribe(
          (addressesByUser) => {
            this.users = users.map((user, index) => {
              const userId = user.userId;
              const userAddresses = addressesByUser[userId] || [];
              return { ...user, addresses: userAddresses, serialNo: index + 1 };
            });

            this.dataSource.data = this.users;
          },
          (error) => {
            console.error('Error fetching addresses:', error);
          }
        );
      },
      (error) => {
        console.error('Error in ngOnInit:', error);
      }
    );
  }

  toggleAccess(user: UserDocument): void {
    this.firebaseService.updateUserAccess(user.userId, user.access);
  }

  newUser(): void {
    const dialogRef = this.dialog.open(UserAddComponent, {
      width: '400px',
      data: {
        task: {},
        enableDelete: false,
      } as UserData,
    });

    dialogRef.afterClosed().subscribe(async (result: UserResult) => {
      if (result && result.task) {
        try {
          const authUser = await this.firebaseService.signup(
            result.task.email,
            result.task.password
          );
          this.firebaseService.addUser(result.task).subscribe(
            (addedUser) => {
              this.users.push(addedUser);
            },
            (firestoreError) => {
              console.error('Error adding user to Firestore:', firestoreError);
            }
          );
        } catch (error) {
          console.error('Error registering user or adding user:', error);
        }
      }
    });
  }

  editUser(user: UserDocument): void {
    const dialogRef = this.dialog.open(UserAddComponent, {
      width: '400px',
      data: {
        task: { ...user },
        enableDelete: true,
      },
    });

    dialogRef.afterClosed().subscribe(async (result: UserResult) => {
      if (result && result.task) {
        try {
          await this.firebaseService.updateUser(result.task);
          const index = this.users.findIndex(
            (u) => u.userId === result.task.userId
          );
          if (index !== -1) {
            this.users[index] = result.task;
          }
        } catch (error) {
          console.error('Error updating user:', error);
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}