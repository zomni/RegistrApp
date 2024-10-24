import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any = {};

  constructor(private userService: UserService) {}

  async ngOnInit() {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = user?.uid;

    if (userId) {
      // Obtener los datos del usuario desde Firebase
      const userDetails = await this.userService.getUser(userId);

      // Asignar los datos al objeto userData
      if (userDetails) {
        this.userData = userDetails;
      }
    }
  }
}
