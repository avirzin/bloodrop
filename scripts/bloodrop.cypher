// Created by Arthur Virzin
// Date: 22/09/2018 22:26

// Cleaning up the database
MATCH (n)
WITH n LIMIT 10000
OPTIONAL MATCH (n)-[r]->()
DELETE n,r;

// IMPORTING THE FOUNDERS

// Creating constraints

create constraint on (a:FOUNDER) assert a.name is unique;

// CREATING THE NODES

// Creating central Theranos node

CREATE (a:STARTUP { name : "Theranos",
                    founder: "Elizabeth Holmes" });

// Creating the nodes from Founders

USING PERIODIC COMMIT 10
LOAD CSV WITH HEADERS FROM "file:/founders.csv" AS line
MERGE (a:FOUNDER {name: line.founder_name,
                  investor_name: line.investor_name});

// Creating the nodes from Rounds

USING PERIODIC COMMIT 10
LOAD CSV WITH HEADERS FROM "file:/rounds.csv" AS line
MERGE (b:ROUND {invested_company: line.invested_company,
                funded_date: line.funded_date,
                raised_amount_usd: line.raised_amount_usd,
                transaction_name: line.transaction_name});

// Creating the nodes from Investments

USING PERIODIC COMMIT 10
LOAD CSV WITH HEADERS FROM "file:/investments.csv" AS line
MERGE (c:INVESTMENT {transaction_name: line.transaction_name,
                company_name: line.company_name,
                investor_name: line.investor_name});

// CREATING THE EDGES

// Rounds & Investments

MATCH (b:ROUND)
MATCH (c:INVESTMENT {transaction_name: b.transaction_name})
CREATE (b)-[:INVESTED_BY]->(c);

// Investments & Founders

MATCH (a:INVESTMENT)
MATCH (b:FOUNDER {investor_name:a.investor_name})
CREATE (a)-[:FOUNDED_BY]->(b); 

// Rounds & Startup

MATCH (a:STARTUP)
MATCH (b:ROUND {invested_company:a.name})
CREATE (a)-[:RAISED]->(b);


// FIX ATA VENTURES CASE (it becomes 2 parent node graph)

// Remove existing relationship between Series B and Ata Ventures
MATCH (:ROUND {transaction_name: "Series B"})-[r:INVESTED_BY]-(:INVESTMENT {investor_name: "ATA Ventures", transaction_name: "Series B"}) 
DELETE r;

// Remove existing relationship between Ata Ventures (Series B) and its founders
MATCH (:INVESTMENT {investor_name: "ATA Ventures", transaction_name: "Series B"})-[r:FOUNDED_BY]-(:FOUNDER {investor_name: "ATA Ventures", name: "Hatch Graham"}) 
DELETE r;
MATCH (:INVESTMENT {investor_name: "ATA Ventures", transaction_name: "Series B"})-[r:FOUNDED_BY]-(:FOUNDER {investor_name: "ATA Ventures", name: "Pete Thomas"}) 
DELETE r;

// Remove Ata Ventures related to Series B
MATCH (n:INVESTMENT {investor_name: "ATA Ventures", transaction_name: "Series B"})
DELETE n;

// Add new relationship to Ata Ventures from Series C round
MATCH (p:ROUND {transaction_name: "Series B"}), (u:INVESTMENT {investor_name: "ATA Ventures"})
CREATE (p)-[:INVESTED_BY]->(u);

// Change node Ata Ventures correcting property relating Series B and Series C
MATCH (n:INVESTMENT {investor_name: "ATA Ventures", transaction_name: "Series C"})
SET n.transaction_name = "Series B, Series C"
RETURN n.transaction_name;

// Show everything
MATCH p=()-[t:RAISED]->()-[r:INVESTED_BY*0..1]->()-[s:FOUNDED_BY*0..1]->() RETURN p  LIMIT ;
