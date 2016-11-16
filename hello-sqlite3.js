var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

// remove database if it exists
var filePath = 'prueba.sqlite3'; 
fs.unlinkSync(filePath);

// Create database
//var db = new sqlite3.Database(':memory:');
var db = new sqlite3.Database('prueba.sqlite3');

db.on('trace', (m)=> console.log(`Running query: ${m}`));
db.on('profile', (m)=> console.log(`Finished query: ${m}`));

/* 
 serialize puts the execution mode into serialized. This means that at most
 one statement object can execute a query at a time. Other statements
 wait in a queue until the previous statements executed.
 the parallelized method puts the execution mode into parallelized.
 This means that queries scheduled will be run in parallel.
*/
db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();
