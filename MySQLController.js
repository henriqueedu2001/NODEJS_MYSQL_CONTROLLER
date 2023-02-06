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
            password: password,
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

    /**
     * basic information of the database.
     * @returns {string} string with the atributes: name, title, description and tables names.
     */
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

    /**
     * Creates the database in the mysql database system.
     * @param {Connection} connection 
     */
    createDatabase(connection) {
        var sqlQuery = "CREATE DATABASE " + this.name;
        connection.con.query(sqlQuery, function(error, result) {
            if(error) throw error;
            console.log("Sucess!");
        });
    }
}

/**
 * Defines a sigle SQL column.
 */
class ColumnDefinition {
    /**
     * Generates a SQL column definition with the column name, type and modifiers.
     * @param {string} name name of the column.
     * @param {string} type SQL types (VARCHAR, INT, FLOAT etc.).
     * @param {string} modifiers SQL modifiers, like UNIQUE or NOT NULL.
     */
    constructor (name, type, modifiers) {
        this.name = name;
        this.type = type;
        this.modifiers = modifiers;
    }

    /**
     * Generates the SQL string that defines the column"
     * @returns {string} the SQL string in the format "name + type + modifiers.
     */
    getString() {
        return this.name + " " + this.type + " " + this.modifiers;
    }
}

/**
 * Defines an set of SQL columns.
 */
class ColumnDefinitions {
    /**
     * Generates a SQL columns definition, all with the column names, types and modifiers.
     * @param {ColumnDefinition[]} columnDefinitions 
     */
    constructor (columnDefinitions){
        this.columnDefinitions = columnDefinitions;
    }

    /**
     * Generates the SQL string that defines the column "
     * @returns {string} The SQL string in the format "column1, column2, ..., columnN
     */
    getString() {
        var finalString = "";
        for(let i = 0; i < this.columnDefinitions.length - 1; i++){
            finalString += this.columnDefinitions[i].getString() + ",\n";
        }
        finalString += this.columnDefinitions[this.columnDefinitions.length - 1].getString();
        
        return finalString;
    }
}

/**
 * Represents a SQL Table, with some extra atributes for the application use such as
 * title and description.
 */
class Table {
    /**
     * Generates an Table object, with name, title, description and content.
     * @param {string} name name of the table.
     * @param {string} title title of the table, with spaces and special characters allowed.
     * @param {string} description descripton of the table.
     * @param {ColumnDefinitions} columnsDefinitions columns SQL definitions.
     */
    constructor (name, title, description, columnsDefinitions) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.columnsDefinitions = columnsDefinitions;
    }

    /**
     * basic information of the table.
     * @returns {string} string with the atributes: name, title, description and columns definitions.
     */
    basicInfo(){
        let info_string = 
            "table: " + this.name + "\n" +
            "title: " + this.title + "\n" +
            "description: " + this.description + "\n" + 
            "columns definitions:\n" + this.columnsDefinitions.getString();

        return info_string;
    }

    createTable(connection, database){
        let sqlQuery = "CREATE TABLE IF NOT EXISTS " + database.name + "." + this.name + " (" + this.columnsDefinitions.getString() + ")";
        connection.con.query(sqlQuery, function(error, result) {
            if (error) throw error;
        });
        console.log(sqlQuery);
    }
}

module.exports = {
    Connection,
    DatabaseGroup,
    Database, 
    Table,
    ColumnDefinition,
    ColumnDefinitions
}