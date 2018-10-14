// Create a new instance of our Neo4j integration module.
var neo4j = Neo4j("neo4j", "neo4j");

// The query to send to Neo4j.
var cypherQuery = "MATCH p=()-[t:RAISED]->()-[r:INVESTED_BY*0..1]->()-[s:FOUNDED_BY*0..1]->() RETURN p  LIMIT 25";

// Optional params for dynamic queries
var params = {};

// Wait for the page to be fully loaded before using KeyLines.
window.onload = function () {
  KeyLines.paths({ assets:'assets/' });
  KeyLines.create('kl', function (err, chart) {
    // Query Neo4j, passing in our cypherQuery, an empty params and a callback.
    // The callback returns an error or the list of chart items in KeyLines format.
    neo4j.query(cypherQuery, params, function (err, items) {
      chart.load({
          type: 'LinkChart',
          items: items
        }, function () {
          chart.layout("standard",function() {
        });
      });
    });
  });
};
