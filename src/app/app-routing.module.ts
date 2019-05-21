import { HomeComponent } from './components/home/home.component';
import { SerialportComponent } from './components/serialport/serialport.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent as MicroDropsComponent } from './components/micro-drops/main/drop-main.component';

const routes: Routes = [
    // {
    //     path: '',
    //     component: HomeComponent
    // },
    // {
    //     path: '',
    //     component: SerialportComponent
    // },
    {
        path: '',
        component: MicroDropsComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
