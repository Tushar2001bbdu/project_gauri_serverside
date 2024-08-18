const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  CreateTableCommand,
  DeleteTableCommand,
} = require("@aws-sdk/client-dynamodb");
const{decryptData}=require("../Data_Security")
let client;
async function createClient(req, res) {
  try {
    client = new DynamoDBClient({
      region: decryptData(process.env.Region),
      credentials: {
        accessKeyId: decryptData(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
      },
    });
    res.status(200).json({
      status: "true",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
    });
  }
}
async function createTable(req, res) {
  const params = {
    TableName: req.body.tablename, // The name of the table
    KeySchema: [{ AttributeName: "PrimaryKey", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "PrimaryKey", AttributeType: req.body.type }, // Define the type for the primary key
      // Optional: Define the type for the sort key if applicable
      // { AttributeName: "SortKey", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: req.body.capacityUnits, // Adjust according to your needs
      WriteCapacityUnits: req.body.capacityUnits,
    },
  };

  const command = new CreateTableCommand(params);

  try {
    const response = await client.send(command);
    res.status(200).json({
      status: "true",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
    });
  }
}
async function deleteTable(req, res) {
  const params = {
    TableName: req.body.tablename,
  };

  const command = new DeleteTableCommand(params);

  try {
    const response = await client.send(command);
    res.status(200).json({
      status: "true",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
    });
  }
}
async function addItem(req, res) {
  try {
    const params = {
      TableName: req.body.tablename,
      Item: {
        PrimaryKey: { S: req.body.primaryKey },

        AttributeName1: { S: req.body.attr1 },
        AttributeName2: { S: req.body.attr2 },
      },
    };
    const command = new PutItemCommand(params);
    const response = await client.send(command);
    res.status(200).json({
      status: "true",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
    });
  }
}
async function getItem(req, res) {
  try {
    const params = {
      TableName: req.body.tablename,
      Key: {
        PrimaryKey: { S: req.body.primaryKey },
      },
    };
    const command = new GetItemCommand(params);
    const response = await client.send(command);
    res.status(200).json({
      status: response.Item,
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
    });
  }
}
async function updateItem(req, res) {
  try {
    const params = {
      TableName: req.body.tablename,
      Key: {
        PrimaryKey: { S: req.body.primaryKey },
      },
      UpdateExpression: "set Attribute1 = :val1",
      ExpressionAttributeValues: {
        ":val1": { S: req.body.updatedValue },
      },
    };
    const command = new UpdateItemCommand(params);
    const response = await client.send(command);
    res.status(200).json({
      status: "true",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
    });
  }
}
async function deleteItem() {
  try {
    const params = {
      TableName: req.body.tablename,
      Key: {
        PrimaryKey: { S: req.body.primaryKey },
      },
    };
    const command = new DeleteItemCommand(params);
    const response = await client.send(command);
    res.status(200).json({
      status: "true",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
    });
  }
}
module.exports = {
  deleteItem,
  getItem,
  updateItem,
  getItem,
  addItem,
  createTable,
  deleteTable,
  createClient,
};
