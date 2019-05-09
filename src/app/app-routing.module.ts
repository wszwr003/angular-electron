import { HomeComponent } from './components/home/home.component';
import { SerialportComponent } from './components/serialport/serialport.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    // {
    //     path: '',
    //     component: HomeComponent
    // },
    {
        path: '',
        component: SerialportComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
