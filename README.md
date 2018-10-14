# Bloodrop

I was so impressed with the book "Bad Blood: Secrets and Lies in a Silicon Valley Startup" that I decided to take a closer look to Theranos investment rounds and how it reached total funding amount of $1.4B.

# Graph Database

To get all the round details I got some data from Crunchbase and stored it in the `data` folder with 3 files to make import data easier:

* `Rounds.csv`;
* `Investments.csv`;
* `Founders.csv`.

The database that I chose was Neo4J. It has very nice documentation and Cypher is a very easy to learn.

# Visualization tools

I would share the whole project, but I chose Keylines from Cambridge Intelligence as my favorite visualization tool but it is not free. It was very easy to implement it and I definetely will use this component in my future projects. Basically all the code is stored in `app.js` and `neo4j.js` under `keylines` folder.

![Theranos investment rounds using Keylines](https://s3.amazonaws.com/flappermedia/other/custom/theranos_graph.png)