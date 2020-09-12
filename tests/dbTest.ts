import { insertUser } from './../src/db/userDb'
import { refreshConnection } from './../src/lib/dbConnect'
import { MysqlError } from 'mysql';
refreshConnection().then(() => {

    insertUser('admin', 'abcdefg').then(res => {
        console.log(res);
    }).catch((err: MysqlError) => {
        console.log(JSON.stringify(err));
        console.log(err.sqlMessage);
    })

})