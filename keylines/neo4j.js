// When this function is called, it creates a module.
Neo4j = function(username, password) {
    var api = {
      // Only the functions of this object will be accessible to the rest of the application.
      query: function(cypherQuery, params, callback) {
        var request = prepareRequest(cypherQuery, params);
        fetch(request, callback);
      }
    };
    var prepareRequest = function(cypherQuery, params) {
      //  This will create an object that will be sent to the Neo4j api.
      return {
        statements: [{
          statement: cypherQuery,
          parameters: params || {},
          resultDataContents: ['graph']
        }]
      };
    };
    var fetch = function(request, callback) {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:7474/db/data/transaction/commit',
        data: JSON.stringify(request),
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        headers: {
          Authorization: 'Basic ' + btoa(username + ':' + password)
        }
      }).then(
        function(response) {
          callback(null, parseResponse(response));
        },
        function(error) {
          callback(error);
        }
      );
    };
    var parseResponse = function (response) {
      var items = [];
      // Get the data from the Neo4j response
      var data = response.results[0].data;
      for (var i = 0; i < data.length; i++) {
        var entryGraph = data[i].graph;
        // iterate through the list of nodes
        for (var j = 0; j < entryGraph.nodes.length; j++) {
          // Convert node to KeyLines format and add it to the items array.
          var node = makeNode(entryGraph.nodes[j]);
          items.push(node);
        }
        // iterate through the list of links (also known as edges or relationships)
        for (var k = 0; k < entryGraph.relationships.length; k++) {
          // Convert link to KeyLines format and add it to the items array.
          var link = makeLink(entryGraph.relationships[k]);
          items.push(link);
        }
      }
      return items;
    };
    var makeNode = function (neoItem) {
        console.log(neoItem);
        var isFounder = neoItem.labels.includes("FOUNDER");
        var isInvestment = neoItem.labels.includes("INVESTMENT");
        var isRound = neoItem.labels.includes("ROUND");
        var isStartup = neoItem.labels.includes("STARTUP");
        var name = neoItem.properties.name || neoItem.properties.investor_name || neoItem.properties.transaction_name;
        var subtitle = neoItem.properties.raised_amount_usd;
        var funded_date = neoItem.properties.funded_date;
      return {
        id: neoItem.id,   // Unique id from Neo4j.
        e: 1,  // Size of the node.
        type: 'node',     // Required, tells KeyLines this object is a node.
        t: isRound? name+'\nU$ '+subtitle +'\nDate: '+funded_date: name,
        u: isFounder? 'images/icons/person.png': isInvestment? 'images/icons/organisation.png': isStartup?'images/icons/theranos.png' :'images/icons/money_bag.png'
      };
    };
    var makeLink = function (neoItem) {
      return {
        id: "link_" + neoItem.id, // Ensure link id can't clash with another node.
        type: 'link',             // Required, tells KeyLines this object is a link.
        id1: neoItem.startNode,   // Node id link connects from.
        id2: neoItem.endNode,    // Node id link connects to.
        t: neoItem.type    
      };
    };  
    return api;
  }
  
