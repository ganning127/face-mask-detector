const nodemailer = require('nodemailer');
const CosmosClient = require("@azure/cosmos").CosmosClient;
// function has not been deployed yet


const config = {
  endpoint: "https://maskup.documents.azure.com:443/",
  key: "W95pvoRphhhUnTfrLF5DCTYwlEHnHe3ntIw3ESr9nb1dxuGHle5174ZOlGmS2DqW41qLYg0huktXzNtmZj7VmA==",
  databaseId: "EmailStorer",
  containerId: "emails",
  partitionKey: {kind: "Hash", paths: ["/emails"]}
}


module.exports = async function (context, myTimer) {

    try {
      await getEmails();
    }
    catch(e) {
      console.log(e)
    }

    return {
      body: "emails have been sent"
    }
    
};

async function getEmails() {
  let emails = [];
  var { endpoint, key, databaseId, containerId } = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);


    const querySpec = {
      query: "SELECT * from c"
    };
    
    // read all items in the Items container
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    
    items.forEach(item => {
      emails.push(item.email);
    });
    console.log(emails)

    await sendMail("Time to wash your hands!", emails, "Wash hands!")

}


async function sendMail(subject, toList, body) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'maskuporg@gmail.com',
          pass: 'maskup2021'
        }
      });
      
      var mailOptions = {
        from: 'maskuporg@gmail.com',
        to: toList,
        subject: subject,
        text: body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}





