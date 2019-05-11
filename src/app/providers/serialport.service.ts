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
    var iconv = this.electronService.iconv;
    this.serialhardwareList = []; // clear before every scan
    this.electronService.serialPort.list().then(ports => {
      console.log('[LOG] List of ports: ', ports)
      ports.forEach(port => {
        portDetails = {
          id: index,
          comName: port.comName,
          manufacturer: iconv.decode(Buffer.from(port.manufacturer, 'utf8'), 'GBK'),//FIXME:web&console display err!  MAY BE USE ICONV NOT ICONV-LITE
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
      data = this.electronService.iconv.decode(data, 'GBK');
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
    let buf = this.electronService.iconv.encode(inputData, 'GBK');   //FIXME:1.Buffer方法已经弃用✔ 2.发送到串口助手中文乱码✔ 3.HEX尚未实现
    this.port.write(buf, err => {
      if (err) {
        return console.log(`[LOG] Error on <${inputData}> command: `, err.message);
      }
    });
  }

}
