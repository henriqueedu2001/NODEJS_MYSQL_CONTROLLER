var mysql = require('mysql2');

/**
 * Represents a connection to the mysql database.
 */
class Connection {
    /**
     * Creates an object with the necessary connection atributes.
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

/**
 * Group of SQL databases, for better organization.
 */
class DatabaseGroup {
    /**
     * Creates an DatabaseGroup object with name, title, description and databases objects.
     * @param {string} name name of the databases group
     * @param {string} title title of the databases group, with spaces and special characters allowed.
     * @param {string} description description of the group.
     * @param {Database[]} databases list of all the databases.
     */
    constructor (name, title, description, databases) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.databases = databases;    
    }

    /**
     * basic information of the database group.
     * @returns {string} string with the atributes: name, title, description and databases names.
     */
    basicInfo(){
        let info_string = 
            "database group: " + this.name + "\n" +
            "title: " + this.title + "\n" +
            "description: " + this.description + "\n" + 
            "databases:\n";
        for(let i = 0; i < this.databases.length; i++){
            info_string += "    —" + this.databases[i].name + "\n";
        }
        return info_string;
    }
}

/**
 * Represents a SQL database, with some extra atributes for the application use such as
 * title and description.
 */
class Database {
    /**
     * Generates an Database object, with name, title, description and tables.
     * @param {string} name name of the database.
     * @param {string} title title of the database, with spaces and special characters allowed.
     * @param {string} description description to the database.
     * @param {Table[]} tables list of all the tables.
     */
    constructor (name, title, description, tables) {
        this.name = name; 
        this.title = title; 
        this.description = description; 
        this.tables = tables;
    }
    basicInfo(){
        let info_string = 
            "database: " + this.name + "\n" +
            "title: " + this.title + "\n" +
            "description: " + this.description + "\n" + 
            "tables:\n";
        for(let i = 0; i < this.tables.length; i++){
            info_string += "    —" + this.tables[i].name + "\n";
        }
        return info_string;
    }
}

/**
 * Represents a SQL Table, with some extra atributes for the application use such as
 * title and description.
 */
class Table {
    /**
     * Generates an Table object, with name, title, description and content.
     * @param {string} name 
     * @param {string} title 
     * @param {string} description 
     */
    constructor (name, title, description, content) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.content = content;
    }
}

module.exports = {
    Connection,
    DatabaseGroup,
    Database, 
    Table
}