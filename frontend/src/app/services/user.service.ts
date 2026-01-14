import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
    active: boolean;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = '/api/admin/users';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
