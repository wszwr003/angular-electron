import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataModel } from '../../../entity/chart.model';

@Component({
  selector: 'app-drop-main',
  templateUrl: './drop-main.component.html',
  styleUrls: ['./drop-main.component.scss']
})
export class MainComponent implements OnInit {
  data: Observable<DataModel>;

  constructor(private http: HttpClient) {
    this.data = this.http.get<DataModel>('./assets/chart-mockdata.json');
  
  }

  ngOnInit() {

  }
  
}
