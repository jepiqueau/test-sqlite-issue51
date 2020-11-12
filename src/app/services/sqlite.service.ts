import { Injectable } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';
import { } from '@capacitor-community/sqlite';
const { CapacitorSQLite } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {

  public isStarted = false;
  private sqlite: any;
  private platform: string;
  private isPlugin = false;
  private readonly SNSErrMessage = 'Service not started';
  private _handlerPermissions: any;


  constructor() {
    console.log("$$$$$$$$$$$$$$$$$$$ in SQLiteService constructor");
   }

  initializePlugin(): boolean {
    console.log("$$$$$$$$$$$$$$$$$$$ in SQLiteService initializePlugin");
    this.platform = Capacitor.platform;
    this.sqlite = CapacitorSQLite;
    const ret = true;
    if (this.platform === 'android') {
      try {
        this.sqlite.requestPermissions();
        return true;
      } catch (e) {
        console.log('Error requesting permissions!' + JSON.stringify(e));
        return false;
      }
    }
    return ret;
  }

  /**
   * Get Echo
   * @param value string
   */
  async getEcho(value: string): Promise<any> {
      return await this.sqlite.echo({value});
  }

  /**
   * Open a Database
   * @param dbName string
   * @param _encrypted boolean optional
   * @param _mode string optional
   */
  async openDB(dbName: string, encrypted = false, mode = 'no-encryption', version = 1): Promise<any> {
    return new Promise (async (resolve) => {
      if (this.platform === 'android') {
        this._handlerPermissions = this.sqlite.addListener('androidPermissionsRequest', async (data:any) => { 
          if (data.permissionGranted === 1) {
            this.isStarted = true;
            resolve(await this.sqlite.open({ database: dbName, encrypted, mode, version }));
          } else {
            resolve({ result: false, message: "Permission not granted" });
          }      
        });
      } else {
        const res = await this.sqlite.open({ database: dbName, encrypted, mode, version });
        if (res.result) this.isStarted = true;
        resolve(res);
      }

    });

  }

  async createSyncTable(): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.createSyncTable();
    } else {
      return Promise.resolve({ changes: -1, message: this.SNSErrMessage });
    }
  }

  /**
   * Execute a set of Raw Statements
   * @param statements string
   */
  async execute(statements: string): Promise<any> {
    if (this.isStarted && statements.length > 0) {
      console.log(JSON.stringify({ statements }));
      return await this.sqlite.execute({ statements });
    } else {
      return Promise.resolve({ changes: -1, message: this.SNSErrMessage });
    }
  }

  /**
   * Execute a set of Raw Statements as Array<any>
   * @param set Array<any>
   */
  async executeSet(set: Array<any>): Promise<any> {
    if (this.isStarted && set.length > 0) {
      return await this.sqlite.executeSet({ set });
    } else {
      return Promise.resolve({ changes: -1, message: this.SNSErrMessage });
    }
  }

  /**
   * Execute a Single Raw Statement
   * @param statement string
   */
  async run(statement: string, values?: Array<any>): Promise<any> {
    if (this.isStarted && statement.length > 0) {
      return await this.sqlite.executeSet({ statement, values });
    } else {
      return Promise.resolve({ changes: -1, message: this.SNSErrMessage });
    }
  }
  /**
   * Query a Single Raw Statement
   * @param statement string
   * @param values Array<string> optional
   */
  async query(statement:string,_values?:Array<string>): Promise<any> {
    const values: Array<any> = _values ? _values : [];
    if(this.isStarted && statement.length > 0) {
      return await this.sqlite.query({statement:statement,values:values});
    } else {
      return Promise.resolve({values:[],message:"Service not started"});
    }

  }
  /**
   * Close the Database
   * @param dbName string
   */
  async close(dbName: string): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.close({ database: dbName });
    } else {
      return Promise.resolve({ changes: false, message: this.SNSErrMessage });
    }
  }

  /**
   * Check if the Database file exists
   * @param dbName string
   */
  async isDBExists(dbName: string): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.isDBExists({ database: dbName });
    } else {
      return Promise.resolve({ changes: false, message: this.SNSErrMessage });
    }
  }

  /**
   * Delete the Database file
   * @param dbName string
   */
  async deleteDB(dbName: string): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.deleteDatabase({ database: dbName });
    } else {
      return Promise.resolve({ changes: false, message: this.SNSErrMessage });
    }
  }

  /**
   * Check the validity of a JSON Object
   * @param jsonstring string
   */
  async isJsonValid(jsonstring: string): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.isJsonValid({ jsonstring });
    } else {
      return Promise.resolve({ changes: false, message: this.SNSErrMessage });
    }
  }

  /**
   * Import a database From a JSON
   * @param jsonstring string
   */
  async importFromJson(jsonstring: string): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.importFromJson({ jsonstring });
    } else {
      return Promise.resolve({ changes: -1, message: this.SNSErrMessage });
    }
  }

  /**
   * Export the given database to a JSON Object
   * @param mode string
   */
  async exportToJson(mode: string): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.exportToJson({ jsonexportmode: mode });
    } else {
      return Promise.resolve({ export: {}, message: this.SNSErrMessage });
    }
  }
  async setSyncDate(syncDate: string): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.setSyncDate({ syncdate: syncDate });
    } else {
      return Promise.resolve({ changes: false, message: this.SNSErrMessage });
    }

  }
  async addUpgradeStatement(database: string, upgrade: any): Promise<any> {
    if (this.isStarted) {
      return await this.sqlite.addUpgradeStatement({
        database,
        upgrade: [upgrade]
      });
    } else {
      return Promise.resolve({ changes: false, message: this.SNSErrMessage });
    }
  }
}
