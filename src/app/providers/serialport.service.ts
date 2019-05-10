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
  public portOpts = { baudRate: 115200, autoOpen: false };
  public receiveData:string;
  public timeout: any;

  ngOnInit() {
  }

  scanHardwares(): Observable<SerialHardware[]> {
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

  openSelectPort(selectedPortId: string): Observable<boolean> {
    this.port = new this.electronService.serialPort(
      selectedPortId,
      this.portOpts,
      err => {
        if (err) {
          console.log('Error opening port: ', err.message);
          return of(false);
        }
      }
    );

    this.port.on('open', () => {
      console.log('[LOG] Port opened: ' + selectedPortId);
    });

    this.port.on('data', data => {
      this.receiveData = data;
      console.log('[ReceiveDATA]: ' + data);
    });

    this.port.open(err => {
      if (err) {
        console.log('[ERR] Error opening port: ' + selectedPortId);
        return of(false);
      }
    });
    return of(true);
  }

  closePort(selectedPortId: string): Observable<boolean> {
    this.port.close(err => {
      if (err) {
        console.log(err.message);
      }
    });
    this.port = null;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.scanHardwares();
    console.log('[LOG] Port closed: ' + selectedPortId);
    return of(false);
  }

  sendData(inputData) {
    inputData = inputData.toString(); // force conversion
    let buf = new Buffer(inputData + '\r', 'utf8'); // append CR

    this.port.write(buf, err => {
      if (err) {
        return console.log(`[LOG] Error on <${inputData}> command: `, err.message);
      }
    });
  }

}
