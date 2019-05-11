import { Component, OnInit } from '@angular/core';
import { SerialportService } from "../../providers/serialport.service";
import { SerialHardware } from "../../entity/serialhardware";
import { SqliteService } from '../../providers/sqlite.service';
@Component({
  selector: 'app-serialport',
  templateUrl: './serialport.component.html',
  styleUrls: ['./serialport.component.scss']
})
export class SerialportComponent implements OnInit {
  public selectedPortId: string;
  public portstate: boolean ;
  public inputData: string = '';

  avalibaleHardwares:SerialHardware[];
  constructor(private sqliteservice: SqliteService,public serialportService: SerialportService) { 
    this.portstate=false;
  }

  ngOnInit() {

  }

  scanHardwares(): void {
    this.selectedPortId = "";
    this.serialportService.scanHardwares()
        .subscribe(avalibaleHardwares => this.avalibaleHardwares = avalibaleHardwares);   //注意订阅不会等待，异步执行！！所以下面语句无法正确打印,加一个timeout就可以
    // setTimeout(()=>{
    //   this.avalibaleHardwares.forEach(Hardware => {
    //     console.log(Hardware.id,Hardware.comName,Hardware.manufacturer,Hardware.vendorId,Hardware.productId);
    //   });
    // },100);
  }

  selectPort($event) {
    console.log($event.target.textContent);
    this.selectedPortId = $event.target.textContent;
    this.avalibaleHardwares = this.avalibaleHardwares.filter(
      element => element.comName === this.selectedPortId
    );
  }

  openSelectPort(selectedPortId:string){
    this.serialportService.openSelectPort(selectedPortId)
      .subscribe(portstate => this.portstate = portstate); 

  }

  closePort(selectedPortId:string){ 
    this.serialportService.closePort(selectedPortId)
      .subscribe(portstate => {
        this.portstate = portstate;
        this.selectedPortId = "";
      }); 
  }

  sendData(inputData:string){
    this.serialportService.sendData(inputData);
    }

  saveData(inputData){
    this.sqliteservice.dbtest();
  }
}
