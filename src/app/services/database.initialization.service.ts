import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';

@Injectable()
export class DatabaseInitializationService {
  readonly dbName = 'testDB';

  readonly initCmd = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT
  );`;

  readonly seedData = 'INSERT INTO products (id, title) VALUES (1, \"Potato\")';

  constructor(private sqliteService: SQLiteService) {
    console.log("%%%%%%%% DatabaseInitializationService constructor %%%%%%");
  }
  
  public async initializeDatabase(): Promise<boolean> {
    return new Promise(async (resolve) => {
      console.log("<<< in initializeDatabase start >>>")
      const isStarted = this.sqliteService.initializePlugin();
      console.log(' isStarted ' + isStarted)
      if(isStarted) {
        console.log("sqliteService is started");
        const value:any = await this.sqliteService.getEcho('Hello!');
        console.log(value.value);
        const retOpen = await this.sqliteService.openDB(this.dbName);
        console.log("Database retOpen.result " + retOpen.result);
        if(retOpen.result) {
          console.log(`Database ${this.dbName} is opened`);
          let result = await this.sqliteService.execute(this.initCmd);
          if(result.changes.changes < 0) {
            console.log(`execute initCmd failed`);
            resolve(false); 
          }
          result = await this.sqliteService.execute(this.seedData);
          console.log("Database result.changes.changes " + result.changes.changes);
          if(result.changes.changes < 0) {
            console.log(`execute seeData failed`);
            resolve(false); 
          }
          console.log("<<< in initializeDatabase end >>>")
          resolve(true);
        } else {
          console.log(`Database ${this.dbName} fails to open: ${retOpen.message}`);
          resolve(false);
        }
      } else {
        console.log("sqliteService fails to start");
        resolve(false);
      }
    });
  }
}
