import { Component, OnInit } from '@angular/core';
import { SerialportService } from "../../providers/serialport.service";
import { SerialHardware } from "../../entity/serialhardware";

@Component({
  selector: 'app-serialport',
  templateUrl: './serialport.component.html',
  styleUrls: ['./serialport.component.scss']
})
export class SerialportComponent implements OnInit {

  avalibaleHardwares:SerialHardware[];

  constructor(private serialportService: SerialportService) { }

  ngOnInit() {

  }

  scanHardwares(): void {
    this.serialportService.scanHardwares()
        .subscribe(avalibaleHardwares => this.avalibaleHardwares = avalibaleHardwares);   //注意订阅不会等待，异步执行！！所以下面语句无法正确打印,加一个timeout就可以
    // setTimeout(()=>{
    //   this.avalibaleHardwares.forEach(Hardware => {
    //     console.log(Hardware.id,Hardware.comName,Hardware.manufacturer,Hardware.vendorId,Hardware.productId);
    //   });
    // },100);
  }

}
