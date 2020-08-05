var express = require('express');
var router = express.Router();
var moment = require('moment');
const objectId = require('mongodb').ObjectId;


/* GET home page. */
module.exports = (db) => {
  const coll = 'data';
  router.get('/', function (req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const { id, string, integer, float, startDate, endDate, boolean, cId, cString, cFloat, cInteger, cDate, cBoolean } = req.query;
    let query = new Object();
    const reg = new RegExp(string);

    if (cId && id) {
      query._id = id;
    }
    if (cString && string) {
      query.string = reg;
    }
    if (cInteger && integer) {
      query.integer = parseInt(integer);
    }
    if (cFloat && float) {
      query.float = parseFloat(float);
    }
    if (cBoolean && boolean) {
      query.boolean = JSON.parse(bool);
    }
    if (cDate && startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate }
    }
    const limit = 3;
    const offset = (page - 1) * limit;

    db.collection(coll).find(query).count()
      .then((total) => {
        const pages = Math.ceil(total / limit)

        db.collection(coll).find(query).limit(limit).skip(offset).toArray()
          .then((result) => {
            res.status(200).json({
              moment,
              result,
              page,
              pages
            })
          })
          .catch((err) => {
            res.status(500).json({
              error: true,
              message: err
            })
          })
      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          message: err
        });
      });
  });

  // ============= Add ================
  router.post('/', (req, res) => {
    const add = { "string": req.body.string, "integer": parseInt(req.body.integer), "float": parseFloat(req.body.float), "date": req.body.date, "boolean": JSON.parse(req.body.boolean) }
    db.collection(coll).insertOne(add)
      .then(() => res.status(201).json({
        error: false,
        message: 'data berhasil ditambahkan'
      }))
      .catch(err =>
        res.status(500).json({
          error: true,
          message: err
        }))
  });

  // Delete
  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.collection(coll).deleteOne({ _id: objectId(id) })
      .then(() => {
        res.status(201).json({
          error: false,
          message: 'data berhasil dihapus'
        })
      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          message: err
        })
      })
  });

  // ================ Show Data Edit ==========

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.collection(coll).findOne({ _id: objectId(id) })
      .then((data) => {
        res.status(200).json({
          data
        })
      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          message: err
        })
      })
  })




  // =============== Edit =====================
  router.put('/:id', (req, res) => {
    const id = req.params.id;
    db.collection(coll).updateOne(
      { _id: objectId(id) },
      {
        $set: {
          string: req.body.string,
          integer: parseInt(req.body.integer),
          float: parseFloat(req.body.float),
          date: req.body.date,
          boolean: JSON.parse(req.body.boolean)
        }
      })
      .then(() => res.status(201).json({
        error : false,
        message : 'data berhasil diganti'
      }))
      .catch((err) => {
        res.status(500).json({
          error: true,
          message: err
        })
      })
  })
  return router;
}

