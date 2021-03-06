const dbConnection = require("./dbConnection");
const clear = require("./autoClear");
const dropCollections = clear.dropCollections;
const clearCollections = clear.clearCollections;

let connectDb = undefined;
let collections = undefined;

module.exports = () => {
	return new Promise((resolve, reject) => {
		dbConnection
			.then(res => {

				connectDb = res.connectDb;
				collectionsInJSON = res.collections;
				removeAllFiles = res.removeAllFiles;
				dropAllCollections = res.dropAllCollections;

				// console.log("removeAllFiles: " + removeAllFiles);
				// console.log('dropAllCollections: ' + dropAllCollections);

				const getCollectionWithName = (colName) => {
					return new Promise((resolve, reject) => {
						if (collectionsInJSON.indexOf(colName) < 0) {
							reject("Error: Collection not found -> " + colName);
							return;
						} else {
							connectDb()
								.then(db => {
									return db.collection(colName);
								})
								.then(col => {
									resolve(col);
								})
								.catch(err => {
									reject(err);
								})
						}
					})
				}

				const getAllCollectionName = () => {
					return Promise.resolve(collectionsInJSON);
				}

				const getDatabase = () => {
					return connectDb();
				}

				connectDb()
					.then(db => {
						if (dropAllCollections) {
							// if client wants to automaticlly drop all duplicate collections
							dropCollections(db, collectionsInJSON);
						}
						if (removeAllFiles) {
							// if client wants to automaticlly drop all duplicate collections
							clearCollections(db);
						}
					})
					.then(() => {
						resolve({
							getCollectionWithName: getCollectionWithName,
							getAllCollectionName: getAllCollectionName,
							getDatabase: getDatabase
						});
					})
					.catch(err => {
						console.log(err.message + "\n\tMake sure you have your mongodb running\n\tMac: brew services start mongodb");
					})
			})
	})
}