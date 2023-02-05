var mysql = require('mysql2');

/**
 * Represents a connection to the mysql database.
 */
class Connection {
    /**
     * creates an object with the necessary connection atributes.
     * @param {string} host host of the database.
     * @param {string} user user of the database.
     * @param {string} password password of the database.
     */
    constructor (host, user, password){
        this.host = host;
        this.user = user;
        this.password = password;
        this.con = mysql.createConnection({
            host: host,
            user: user,
            password: password
        });
    }

    /**
     * Connects to the mysql database, using the atributes defined in this object.
     */
    connect(){
        this.con.connect(function (err) {
            if (err){
                throw err;
            } else {
                console.log("connected to the MySQL database");
            }
        });
    }
    /**
     * Connects to the specified mysql database, using the atributes defined in this object.
     * @param {string} database database name
     */
    connect(database){
        this.con.database = database;
        this.con.connect(function (err) {
            if (err){
                throw err;
            } else {
                console.log("connected to the MySQL");
            }
        });
    }
}

module.exports = {
    Connection
}