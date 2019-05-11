import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import * as SerialPort from 'serialport';
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as iconv  from 'iconv-lite';
import * as sqlite  from 'sqlite3';
import * as mysql  from 'mysql';

@Injectable()
export class ElectronService {

  serialPort: typeof SerialPort;
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  iconv: typeof iconv;
  sqlite: typeof sqlite;
  mysql: typeof mysql;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      //FIXME:都写在isElectron里面会造成网页打开时无法使用？
      this.serialPort = window.require('serialport');
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.iconv = window.require('iconv-lite'); //fix windows下串口相互无法发送中文
      this.sqlite = (window.require('sqlite3')).verbose();
      this.mysql = (window.require('mysql'));
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
