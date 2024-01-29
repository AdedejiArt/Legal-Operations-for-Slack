// const express = require('express');
// const bodyParser = require('body-parser');
// const request = require('request');
// const { WebClient } = require('@slack/web-api');

// const app = express();
// app.use(bodyParser.json());

// // Set up the Asana webhook
// app.post('/webhook', async (req, res) => {
//   const { events } = req.body;
//   for (const event of events) {
//     if (event.action === 'changed' && event.fields.includes('completed')) {
//       const taskId = event.resource.id;
//       console.log(`Task ${taskId} has been marked completed`);
      
//       // Use the Asana API to get the task details
//       const asanaUrl = `https://app.asana.com/api/1.0/tasks/${taskId}`;
//       const options = {
//         url: asanaUrl,
//         headers: {
//           'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`
//         }
//       };
//       request(options, async (error, response, body) => {
//         if (error) {
//           console.error(error);
//         } else {
//           const task = JSON.parse(body).data;
//           const taskName = task.name;
//           const assigneeId = task.assignee.id;
          
//           // Use the Slack API to send a message to the task assignee
//           const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
//           const messageText = `Task "${taskName}" has been marked completed on Asana`;
//           const result = await slackClient.chat.postMessage({
//             channel: assigneeId,
//             text: messageText
//           });
//           console.log(`Message sent to user ${assigneeId}: ${messageText}`);
//         }
//       });
//     }
//   }
//   res.sendStatus(200);
// });

// (async () => {
//   // Start the app
//   await app.start(process.env.PORT || 3000);

//   console.log('App is running!');
// })();

const axios = require('axios');

// Set up your API key, organization ID, agreement UID, and field values
const fieldsToUpdate = [
  {
    uuid: 'f96b1818-b5fa-4e83-a54b-66d08cfb6733',
    values: ['New Payment Frequency']
  },
  {
    uuid: '9981345c-9f64-4260-8012-8e7b5723a2e4',
    values: ['New Client Location']
  },
  {
    uuid: 'dbbd8d06-ad63-4b21-879a-2ba1ed4b92ec',
    values: ['New Client Full Name']
  },
  {
    uuid: '4f14dc82-126e-4735-b00c-3cf06c65b73b',
    values: ['New Service Fee']
  }
];

// Prepare the updated field data
const fieldData = {
  fields: []
};

// Iterate over the fields and ensure required properties are present
fieldsToUpdate.forEach(field => {
  const { uuid, values } = field;
  
  if (uuid && values) {
    fieldData.fields.push({
      ...field,
      required: true,
      type: 'TEXT',
      reservation: {
        type: 'NONE'
      }
    });
  } else {
    console.error('Field is missing required properties:', field);
  }
});

// Make the PATCH request to update the field values
axios.patch(`https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements/02tBEtYJyOWj5YfZ8q9Fuk/versions/last/fields`, fieldData, {
  headers: {
     'X-API-KEY':apiKey
  }
})
  .then(updateResponse => {
    console.log('Field values updated:', updateResponse.data);
  })
  .catch(updateError => {
    console.error('Error updating field values:', updateError.response.data);
  });





















  axios.get(`https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements/02tBEtYJyOWj5YfZ8q9Fuk/versions/last/fields`,
  {
    headers: {
       'X-API-KEY':apiKey
    }
  }
  
  )
    .then(response => {
      const existingFields = response.data.fields;
  
      // Extract the list of fields into an array of dictionaries
      const fieldsList = existingFields.map(field => ({
        uuid: field.uuid,
        values: field.values || []
      }));
  
      // console.log('Fields List:', fieldsList);
      const uuidList = fieldsList.map(field => field.uuid);

    // console.log('UUID List:', uuidList);
    const taskName = "Hello World";
   const documentLink =  "Ope";
  const partner = "Boy";
  const context = "Love";
  
  
  const updatedFieldValues = [
    { uuid: uuidList[0], values: [taskName] },
    { uuid: uuidList[1], values: [documentLink]},
     { uuid: uuidList[2], values: [partner]},
     { uuid: uuidList[3], values: [context]}
     ,
    // Add more field UUIDs and their respective values as needed
  ];


      const fieldData = {
        fields: []
      };
      
      // Iterate over the fields and ensure required properties are present
      updatedFieldValues.forEach(field => {
        const { uuid, values } = field;
        
        if (uuid && values) {
          fieldData.fields.push({
            ...field,
            required: true,
            type: 'TEXT',
            reservation: {
              type: 'NONE'
            }
          });
        } else {
          console.error('Field is missing required properties:', field);
        }
      });
  
      axios.patch(`https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements/02tBEtYJyOWj5YfZ8q9Fuk/versions/last/fields`, fieldData, {
        headers: {
           'X-API-KEY':apiKey
        }
      })
        .then(updateResponse => {
          console.log('Field values updated:', updateResponse.data);
        })
        .catch(updateError => {
          console.error('Error updating field values:', updateError.response.data);
        });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    })
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    .catch(error => {
      console.error('Error fetching field data:', error.response.data);
    });
  