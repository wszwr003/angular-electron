import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Observable, of } from 'rxjs';
import { SerialHardware } from "../entity/serialhardware";


@Injectable({
  providedIn: 'root'
})
export class SerialportService {
  constructor(public electronService: ElectronService) {
  }

  public serialhardwareList: SerialHardware[];
  public port: any;
  public selectedPortId: string;
  public portOpts = { baudRate: 115200, autoOpen: false };

  ngOnInit() {
  }

  scanHardwares(): Observable<SerialHardware[]> {
    this.selectedPortId = ''
    let index = 1
    let portDetails: any
    this.serialhardwareList = []; // clear before every scan
    this.electronService.serialPort.list().then(ports => {
      console.log('[LOG] List of ports: ', ports)
      ports.forEach(port => {
        portDetails = {
          id: index,
          comName: port.comName,
          manufacturer: port.manufacturer,
          vendorId: port.vendorId,
          productId: port.productId
        };
        this.serialhardwareList.push(portDetails);
        index++;
      });
    });
    return of(this.serialhardwareList);
  }




}
