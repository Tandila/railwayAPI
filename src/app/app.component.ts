import {Component, OnInit} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {FormControl, FormGroup, Validators} from "@angular/forms";

export interface Users {
  id?: number
  username: string
  password: string
  password2: string
  email: string
  country: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;

  user: Users[] = []
  email = ''
  username = ''
  password = ''
  country = ''

  constructor(private http: HttpClient) {}

  ngOnInit() {

    this.form = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.pattern('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])'),
        Validators.required
      ])),
      password: new FormControl(null,[
        Validators.required,
        Validators.minLength(6)
      ]),
      username: new FormControl(null,[
        Validators.required,
      ]),
      country: new FormControl(null,[
        Validators.required,
      ])

    })

    this.http.get<Users[]>('http://172.28.28.22:7001/api/Employees')
      .subscribe(user => {
        console.log('Response', user)
        this.user = user
      })
  }

  addUser() {
    const newUser: Users = {
      username: this.form.value.username,
      password: this.form.value.password,
      password2: this.form.value.password,
      email: this.form.value.email,
      country: this.form.value.country,
    }
    this.http.post<Users>('http://172.28.28.22:7001/api/Employees', newUser)
        .subscribe(user => {
          console.log('user', user)
          this.user.push(user)
          this.form.reset()
        })
  }

  removeUser(id: number) {
    this.http.delete<void>(`http://172.28.28.22:7001/api/Employees/${id}`)
        .subscribe(() => {
          this.user = this.user.filter(i => i.id !== id)
        })
  }

}

