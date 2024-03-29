const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
  counter.getNextUniqueId((err, fileID) => {
    fs.writeFile(path.join(exports.dataDir, `${fileID}.txt`), text, (err) => {
      if (err) {
        console.log('whoops!');
      } else {
        callback(null, { id: fileID, 'text': text });
      }
    })
  });
};
// var data = _.map(items, (text, id) => {
//   return { id, text };
// });
// callback(null, data);
//1 readdir==> files dir[]
//2.dir==>read files
//3.all file get read==> invoke callback
//[{promise},{promise}]
exports.readAll = (callback) => {

  new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  }).then((data) => {
    var promiseArray = data.map((item) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path.join(exports.dataDir, `${item}`), 'utf8', (err, fileData) => {
          if (err) {
            reject(err)
          } else {
            var toDoObj = { id: item.slice(0, -4), text: fileData }
            resolve(toDoObj)
          }
        })
      })
    })
    return promiseArray
  }).then((promiseArray) => {
    return Promise.all(promiseArray)
  }).then((formattedData) => {
    callback(null, formattedData)
  })

  // fs.readdir(exports.dataDir, (err, data) => {
  //   var formattedData = data.map((item) => {
  //     return { id: item.slice(0, -4), text: item.slice(0, -4) }
  //   })
  //   callback(null, formattedData)
  // })

};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
    if (err) {
      //throw ('toDo is not exist')
      callback(new Error('toDo is not exist'))
    } else {
      callback(null, { id, text: fileData.toString() });
    }
  })
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  // bind result of calling readAll to a var
  // if that array includes input ID
  // do the below writeFile action with that ID
  // else, throw the 'no item with id' error

  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`))
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          throw new Error('error updating file')
        } else {
          callback(null, { id, text })
        }
      })
    }
  })


};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`))
    } else {
      fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
        if (err) {
          throw new Error('error deleting file')
        } else {
          callback()
        }
      })
    }
  })

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
  // exports.readOne(id, (err, data) => {
  //   if (err) {
  //     callback(new Error(`No item with id: ${id}`))
  //   } else {
  //     fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
  //       if (err) {
  //         throw ('error writing counter')
  //       } else {
  //         callback(null, { id, text })
  //       }
  //     })
  //   }
  // })