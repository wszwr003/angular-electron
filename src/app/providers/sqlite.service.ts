import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { defineBase } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  public db = new this.electronService.sqlite.Database(':memory:'); 

  constructor(public electronService: ElectronService) {
  }
  
  dbset(){
    var temp = this.db;
    temp.serialize(()=> {
      temp.run("CREATE TABLE lorem (info TEXT)");
      var stmt = this.db.prepare("INSERT INTO lorem VALUES (?)");
      for (var i = 0; i < 10; i++) {
          stmt.run("Ipsum " + i);
      }
      stmt.finalize();
      temp.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
          console.log(row.id + ": " + row.info);
      });
    });
    this.db.close();
  }
  
}
