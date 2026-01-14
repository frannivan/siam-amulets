import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../services/user.service';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './users.component.html'
})
export class AdminUsersComponent implements OnInit {
    users: User[] = [];
    loading = true;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        this.userService.getUsers().subscribe({
            next: (data: User[]) => {
                this.users = data;
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Failed to load users', err);
                this.loading = false;
            }
        });
    }

    deleteUser(id: number) {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            this.userService.deleteUser(id).subscribe({
                next: () => {
                    this.users = this.users.filter(u => u.id !== id);
                },
                error: (err: any) => {
                    console.error('Failed to delete user', err);
                    alert('Failed to delete user');
                }
            });
        }
    }
}
