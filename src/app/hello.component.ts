import { Component } from '@angular/core';
import {
  delay,
  filter,
  map,
  of,
  switchMap,
  toArray,
  forkJoin,
  Observable,
} from 'rxjs';

@Component({
  selector: 'hello',
  template: `<h1>Home Insurance beautiful apps:</h1>
  <div *ngIf="hiApps$ | async as apps">
    <div>App names</div>
    <li *ngFor="let app of apps">{{app.appName}}</li><br>
    <div>App IDs</div>
    <li *ngFor="let id of hiAppsIds$ | async">{{id}}</li><br>
    <div>A simple filter: {{ filterById$ | async }}</div>
  </div><br>
  <div>A spinner example</div><br>
  <div *ngIf="usersList$ | async as usersList; else spinner">
    
    <table>
    <thead>
        <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>ROLE</th>
        </tr>
    </thead>
    <tbody>
        <tr *ngFor="let people of usersList">
            <td>{{people.id}}</td>
            <td>{{people.name}}</td>
            <td>{{people.role}}</td>
        </tr>
    </tbody>
</table>
  </div>
    
  <ng-template #spinner>
    <spinner></spinner>
  </ng-template>`,
  styles: [`h1 { font-family: Lato; },`],
})
export class HelloComponent {
  hiApps = [
    { appId: 1, appName: 'MyGenerali' },
    { appId: 2, appName: 'MyAlleanza' },
    { appId: 3, appName: 'MyCattolica' },
  ];

  hiApps$ = of(this.hiApps);
  hiAppsIds$ = this.hiApps$.pipe(
    switchMap((apps) => apps),
    map((apps) => apps?.appId),
    toArray()
  );

  filterById$ = this.hiAppsIds$.pipe(
    filter((ids) => ids.every((id) => id > 0))
  );

  usersList$: Observable<{ id; name; role }[]>;

  ngOnInit() {
    //avoid doing this
    /* this.hiApps$.subscribe((value) => {
      console.log(value)
    this.something = value}
    ); */

    this.usersList$ = forkJoin({
      users: of([
        { uId: 1, name: 'Pippo', role: '001' },
        { uId: 2, name: 'Pluto', role: '002' },
        { uId: 3, name: 'Paperino', role: '003' },
      ]),
      roles: of([
        { roleId: '001', roleName: 'admin' },
        { roleId: '002', roleName: 'dev' },
        { roleId: '003', roleName: 'mantainer' },
      ]),
    }).pipe(
      delay(3000),
      map((result) =>
        result.users.map((u) => {
          return {
            id: u.uId,
            name: u.name,
            role: result.roles.find((role) => role.roleId === u.role).roleName,
          };
        })
      )
    );
  }

  //use a pipe to fetch role name from BE: user.role | rolePipe | async
}
