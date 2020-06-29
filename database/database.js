const lowdb = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json');
const db = lowdb(adapter);

db._.mixin(lodashId);

const moviesCollection = db.defaults({movies: []}).get('movies');
const commentsCollection = db.defaults({comments: []}).get('comments');

exports.moviesCollection = moviesCollection;
exports.commentsCollection = commentsCollection;
