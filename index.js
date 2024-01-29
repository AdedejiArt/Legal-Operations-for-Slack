require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api');
const { App, ExpressReceiver } = require('@slack/bolt');
const request = require('request');
const asana = require('asana');
const axios = require('axios');
const apiKey = ' ';
const contractTemplateId = '02tQbjILQr6QG21Dr33dt1';
const organizationId = 1018273;
const { Readable } = require('stream');
const payload = {
    "organizationId": 1018273,
    "source": {
      "uid": contractTemplateId,
      "templatingParameters": {
        "property1": "string",
        "property2": "string"
      }
    },
    "folderId": 1165083,
    "status": "DRAFT",
    "parametersSource": "NONE",
    "title": "Non-Disclosure Agreement",
    "description": "This NDA covers the company for 10 years.",
    "tags": [
      "string"
    ],
    "parties": {
        'Party A': {
          name: 'John Doe',
          email: 'a.roheem@alustudent.com',
        },
        'Party B': {
          name: 'Jane Smith',
          email: 'adiobusrat@gmail.com',
        },
      },
    
  };
  const payloadr={
    "invitations": {
      "adiobusrat@gmail.com": {
        "permission": "NO_EDIT"
        
      }
    },
    "message": {
      "subject": "Invitation to sign",
      "content": "Hello, this is an invite for a Non-Disclosure Agreement.",
      "name": "Internal message name"
    },
    "saveMessage": false,
    "sendWithDocument": false
  }

  const payloadt = {
    "organizationId": 1018273,
    "source": {
      "uid": '02tQbfMzwrtknGOMecPTVh',
      "templatingParameters": {
        "property1": "string",
        "property2": "string"
      }
    },
    "folderId": 1165083,
    "status": "DRAFT",
    "parametersSource": "NONE",
    "title": "Termination Agreement",
    "description": "This terminates the agreement between two parties.",
    "tags": [
      "string"
    ],
    "parties": {
        'Party A': {
          name: 'John Doe',
          email: 'a.roheem@alustudent.com',
        },
        'Party B': {
          name: 'Jane Smith',
          email: 'adiobusrat@gmail.com',
        },
      },
    
  };

  const payloadd={
    "email": {
      "value": "a.roheem@alustudent.com"
    },
    "permission": "NO_EDIT",
    
    "customMessageContent": "An Ammendment has been made to your contract, Please review",
    "sendWithDocument": false,
    
  }




const abi = express();
abi.use(bodyParser.json());
const asana_client = asana.Client.create().useAccessToken('process.env.ASANA_ACCESS_TOKEN');

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });
 
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// Slack app home page
app.event('app_home_opened', async ({ event, context }) => {
  try {
    console.log(event)
    const result = await app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: {
        type: 'home',
        callback_id: 'home_view',
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Hey there! Welcome to L-automate. I am here to help you with your legal needs."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Automated Contract Creation*"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": " You can create contracts without needing to reach out to the In-house legal teams.They would receive notifications that you have created a contract, Don't Worry! "
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Create a freelancer Contract"
                },
                "action_id": "new_freelancer_alu_selector"
              },
              // {
              //   "type": "button",
              //   "text": {
              //     "type": "plain_text",
              //     "text": "Create a Vendor Contract"
              //   },
              //   "action_id": "vendor_request"
              // },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Create an NDA"
                },
                "action_id": "nda_create"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Create an Mou"
                },
                "action_id": "mou_create"
              }
            ]
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Create New Legal Requests*"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Let the legal team know what you need from them?"
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Review and Sign a Contract"
                },
                "action_id": "contract_review"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "You wanna access Company Documents"
                },
                "action_id": "documentation_request"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "You wanna ask a question"
                },
                "action_id": "advice_request"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "You need a template!"
                },
                "action_id": "template_request"
              }
            ]
          }
        ],
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

// Handle button click on the app home page
app.action('contract_review', async ({ ack, body, context }) => {
  try {
    // Acknowledge the button click
    await ack();

    // Open a modal to gather user input
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'task_submission',
        title: {
          type: 'plain_text',
          text: 'Create a New Task',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'task_name',
            element: {
              type: 'plain_text_input',
              action_id: 'task_name_input',
            },
            label: {
              type: 'plain_text',
              text: 'Task Name',
            },
          },
          {
            "type": "input",
            "block_id": "Document_Link",
            "hint": {"type": "plain_text", "text": "Please make sure this link is publicly available so the team can see it."},
            "label": {"type": "plain_text", "text": "Please paste a link to the document to review"},
            "element": {
                "type": "plain_text_input",
                "action_id": "link_input"
            }
        }, {
            "type": "input",
            "block_id": "Partner",
            "label": {"type": "plain_text", "text": "Who is this contract with?"},
            "element": {
                "type": "plain_text_input",
                "action_id": "partner_input"
            }
        }, {
            "type": "input",
            "block_id": "Context",
            "label": {"type": "plain_text", "text": "Why are we reviewing this contract?"},
            "hint": {"type": "plain_text", "text": "Please provide any additional context you can to the team."},
            "element": {
                "type": "plain_text_input",
                "action_id": "context_input",
                'multiline': true
            }
        }, {"type": "input", 
                "block_id": "Value", 
                "label": 
                {
                  "type": "plain_text", 
                  "text": "How would you estimate the total value of this contract?:"
                },
                "element": {
                          "type": "radio_buttons",
                          "action_id": "value_input",
                          "options": [{
                                      "text": {
                                          "type": "plain_text",
                                          "text": "50,000 usd or lower"
                                        },
                                        "value": "low"
                                  },
                                  {
                                      "text": {
                                          "type": "plain_text",
                                          "text": "Over 50,000 usd"
                                        },
                                        "value": "high"
                                  }
                            ]
                        }
                    }, 
                   
        ],
        submit: {
          type: 'plain_text',
          text: 'Create',
        },
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});
app.action('documentation_request', async ({ ack, body, context }) => {
  try {
    // Acknowledge the button click
    await ack();

    // Open a modal to gather user input
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'documentation_task_submission',
        title: {
          type: 'plain_text',
          text: 'Create a New Task',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'task_name',
            element: {
              type: 'plain_text_input',
              action_id: 'task_name_input',
            },
            label: {
              type: 'plain_text',
              text: 'Task Name',
            },
          },
         
          {
            type: 'input',
            block_id: 'task_description',
            element: {
              type: 'plain_text_input',
              action_id: 'task_description_input',
            },
            label: {
              type: 'plain_text',
              text: 'Description',
            },
          },
          
        ],
        submit: {
          type: 'plain_text',
          text: 'Create',
        },
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

app.action('nda_create', async ({ ack, body, context }) => {
  try {
    // Acknowledge the button click
    await ack();

    // Open a modal to gather user input
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'contract_submission',
        title: {
          type: 'plain_text',
          text: 'Create a New Contract',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'document_title',
            element: {
              type: 'plain_text_input',
              action_id: 'document_title_input',
            },
            label: {
              type: 'plain_text',
              text: 'What is the Name of the receipient of this contract',
            },
          },
         
          {
            type: 'input',
            block_id: 'client_location',
            element: {
              type: 'plain_text_input',
              action_id: 'contract_type_input',
            },
            label: {
              type: 'plain_text',
              text: 'What is the Client Location',
            },
          },
            
          {
            type: 'input',
            block_id: 'payment_frequency',
            element: {
              type: 'plain_text_input',
              action_id: 'payment_frequency_input',
            },
            label: {
              type: 'plain_text',
              text: 'What is the Payment Frequency',
            },
          },
            
           
            
          {
            type: 'input',
            block_id: 'service_fee',
            element: {
              type: 'plain_text_input',
              action_id: 'service_fee_input',
            },
            label: {
              type: 'plain_text',
              text: 'What is the Service fee',
            },
          },
          {
            "type": "input",
            "block_id": "party_a",
            "label": {
              "type": "plain_text",
              "text": "Enter your email address"
            },
            "element": {
              "type": "plain_text_input",
              "action_id": "party_a_input",
              "placeholder": {
                "type": "plain_text",
                "text": "example@example.com"
              }
            }
          },
        ],
        submit: {
          type: 'plain_text',
          text: 'Create',
        },
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

 
 
// Handle the "task_submission" view submission
app.view('task_submission', async ({ ack, body, view, context }) => {
  try {
    // Acknowledge the view submission
    await ack();

    // Extract user input from the view
    const creator_name = body.user.name
    const originaltaskName = view.state.values.task_name.task_name_input.value;
    const updatedtaskName = `R1-${originaltaskName}-${creator_name}`
    const document_link=view.state.values.Document_Link.link_input.value;
    const Partner=view.state.values.Partner.partner_input.value; 
    const context = view.state.values.Context.context_input.value;
   
    const value = view.state.values.Value.value_input.value;
   
    // const description = view.state.values.task_description.task_description_input.value;
    

    function calculateDeadlines(fromDate, taskDuration) {
      while (taskDuration > 0) {
        fromDate.setDate(fromDate.getDate() + 1);
    
        if (fromDate.getDay() === 0 || fromDate.getDay() === 6) {
          continue;
        }
    
        taskDuration--;
      }
    
      return fromDate.toISOString().split('T')[0];
    }
    const duegan= calculateDeadlines(new Date(),3)

    const createSubtask = (parentTaskId) => {
      const options = {
        url: `https://app.asana.com/api/1.0/tasks/${parentTaskId}/subtasks`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      };
    
      for (let i = 0; i < 3; i++) {
        if (i===0){
          options.body = JSON.stringify({
            data: {
              name: "Request for the contract",
              approval_status: "pending",
              due_on: calculateDeadlines(new Date(), 1),
               
            },
          });

        }else if(i===1){
          options.body = JSON.stringify({
            data: {
              name: "Retrive the contract",
              approval_status: "pending",
              due_on: calculateDeadlines(new Date(), 2),
               
            },
          });
        }else if(i===2){
          options.body = JSON.stringify({
            data: {
              name: "Review the contract",
              approval_status: "pending",
              due_on: calculateDeadlines(new Date(), 3),
               
            },
          });
        }
       
    
        request(options, (error, response, body) => {
          if (error) {
            console.error('Error creating subtask:', error);
            return;
          }
    
          console.log('Subtask created successfully:');
          console.log(body);
        });
      }
    };
    
     
    
      // const dueDate = calculateDeadlines(currentTimeMillis, 2)

    // Asana API endpoint to create a new task
    const url = 'https://app.asana.com/api/1.0/tasks';

    // Asana API request parameters
    const options = {
      method: 'POST',
      url,
      headers: {
        'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: {
        data: {
          name: updatedtaskName,
          assignee: "me",
          notes: context,
          due_on: duegan,
          html_notes:"<body><strong><em>Context:</em></strong>"+ document_link+ "<strong><em>Objective:</em></strong>"+ Partner + value + "</body>",
          workspace:'1203000597959895'
        },
      },
      json: true,
    };
     

    // Send the task creation request to the Asana API
    request(options, async (error, response, asanaBody) => {
      if (error) {
        console.error(error);
      } else {
        // console.log('Asana API response:', asanaBody);
        console.log(asanaBody.data.gid)
        const subtaskName = 'Complete subtask';
        createSubtask(asanaBody.data.gid);


        // Construct the message text with the link to the new task
        const taskLink = asanaBody.data.permalink_url;
        const messageText = `New task "${updatedtaskName}" has been created: ${taskLink}`;

        // Send a message to the user who submitted the form
        const userId = body.user.id;
        console.log('User ID:', userId);
        await app.client.chat.postMessage({
          token: context.botToken,
          channel: userId,
          text: messageText,
        });
      }
    });
    const updatedView = {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Updated Modal Title'
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Thanks for submitting the form!'
          }
        }
      ]
    };

    
      await app.client.views.update({
        token: process.env.SLACK_BOT_TOKEN,
        view_id: body.view.id,
        hash: body.view.hash,
        view: updatedView,
        response_action: 'update'
      });


  } catch (error) {
    console.error(error);
  }
});

 
 

app.view('documentation_task_submission', async ({ ack, body, view, context }) => {
  try {
    // Acknowledge the view submission
    await ack();

    // Extract user input from the view
    const creator_name = body.user.name
    const originaltaskName = view.state.values.task_name.task_name_input.value;
    const updatedtaskName = `A1-${originaltaskName}-${creator_name}`
    const taskdescription=view.state.values.task_description.task_description_input.value;
     

    function calculateDeadlines(fromDate, taskDuration) {
      while (taskDuration > 0) {
        fromDate.setDate(fromDate.getDate() + 1);
    
        if (fromDate.getDay() === 0 || fromDate.getDay() === 6) {
          continue;
        }
    
        taskDuration--;
      }
    
      return fromDate.toISOString().split('T')[0];
    }
    const duegan= calculateDeadlines(new Date(),2)

    const createSubtask = (parentTaskId) => {
      const options = {
        url: `https://app.asana.com/api/1.0/tasks/${parentTaskId}/subtasks`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      };
    
      for (let i = 0; i < 2; i++) {
        if (i===0){
          options.body = JSON.stringify({
            data: {
              name: "Request for the document",
              approval_status: "pending",
              due_on: calculateDeadlines(new Date(), 1),
               
            },
          });

        }else if(i===1){
          options.body = JSON.stringify({
            data: {
              name: "Share the document",
              approval_status: "pending",
              due_on: calculateDeadlines(new Date(), 2),
               
            },
          });
        } 
       
    
        request(options, (error, response, body) => {
          if (error) {
            console.error('Error creating subtask:', error);
            return;
          }
    
          console.log('Subtask created successfully:');
          console.log(body);
        });
      }
    };
    
     
    
      // const dueDate = calculateDeadlines(currentTimeMillis, 2)

    // Asana API endpoint to create a new task
    const url = 'https://app.asana.com/api/1.0/tasks';

    // Asana API request parameters
    const options = {
      method: 'POST',
      url,
      headers: {
        'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: {
        data: {
          name: updatedtaskName,
          assignee: "me",
          notes: taskdescription,
          due_on: duegan,
          
          workspace:'1203000597959895'
        },
      },
      json: true,
    };
     

    // Send the task creation request to the Asana API
    request(options, async (error, response, asanaBody) => {
      if (error) {
        console.error(error);
      } else {
        // console.log('Asana API response:', asanaBody);
        console.log(asanaBody.data.gid)
        const subtaskName = 'Complete subtask';
        createSubtask(asanaBody.data.gid);


        // Construct the message text with the link to the new task
        const taskLink = asanaBody.data.permalink_url;
        const messageText = `New task "${updatedtaskName}" has been created: ${taskLink}`;

        // Send a message to the user who submitted the form
        const userId = body.user.id;
        console.log('User ID:', userId);
        await app.client.chat.postMessage({
          token: context.botToken,
          channel: userId,
          text: messageText,
        });
      }
    });
    const updatedView = {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Updated Modal Title'
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Thanks for submitting the form!'
          }
        }
      ]
    };

    
      await app.client.views.update({
        token: process.env.SLACK_BOT_TOKEN,
        view_id: body.view.id,
        hash: body.view.hash,
        view: updatedView,
        response_action: 'update'
      });


  } catch (error) {
    console.error(error);
  }
});

 
 


  
   
  app.view('contract_submission', async ({ ack, event, body, view, context, client }) => {
    try {
      // Acknowledge the view submission
      await ack();
      const user = body.user.name
      // console.log(body)
      const contracttitle=view.state.values.document_title.document_title_input.value;
      const clientlocation=view.state.values.client_location.contract_type_input.value;
      const paymentfrequency=view.state.values.payment_frequency.payment_frequency_input.value;
      const servicefee=view.state.values.service_fee.service_fee_input.value;
      const newEmailAddress = view.state.values.party_a.party_a_input.value;
      const approvalMessage = `${user} has just created a contract and requests your approval\nContract Title: ${contracttitle}\nClient Location: ${clientlocation}\nPayment Frequency: ${paymentfrequency}\nService Fee: ${servicefee}\nEmail Address: ${newEmailAddress}`;
  
      // Slack channel ID where the approval message will be sent
      const channel = 'U04L7KS51U5';
      const userId = body.user.id;
      console.log(userId)
  
      // Send the approval message to the Slack channel
      await client.chat.postMessage({
        channel,
        text: 'Approval Required',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: approvalMessage,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Approve',
                },
                style: 'primary',
                action_id: 'approve_contract',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Reject',
                },
                style: 'danger',
                action_id: 'reject_contract',
              },
            ],
          },
        ],
      });
     const updatedView = {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: 'Updated Modal Title'
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Thanks for submitting the form!'
              }
            }
          ]
        };
  
        
          await app.client.views.update({
            token: process.env.SLACK_BOT_TOKEN,
            view_id: body.view.id,
            hash: body.view.hash,
            view: updatedView,
            response_action: 'update'
          });
   } catch (error) {
     console.error(error);
   }
 });


 app.action('approve_contract', async ({ ack, body, context, client }) => {
  try {
    // Acknowledge the action
    await ack();
 const contracttitle = body.message.blocks[0].text.text.split('\n')[1].split(':')[1].trim();
 const clientlocation = body.message.blocks[0].text.text.split('\n')[2].split(':')[1].trim();
 const paymentfrequency = body.message.blocks[0].text.text.split('\n')[3].split(':')[1].trim();
 const servicefee = body.message.blocks[0].text.text.split('\n')[4].split(':')[1].trim();
 const emailRegex = /<mailto:([^|]+)/;
 const match = body.message.blocks[0].text.text.match(emailRegex);
 const newEmailAddress = match ? match[1].trim() : null;
    
    console.log("Hellow world")
    payload["title"] = `${contracttitle}-NDA-Contract`
      payloadr.invitations[newEmailAddress] = payloadr.invitations['adiobusrat@gmail.com'];
      delete payloadr.invitations['adiobusrat@gmail.com'];
      console.log(payloadr.invitations)
      console.log(contracttitle)
      console.log(newEmailAddress)

      // Extract user input from the view
      const response = await axios.post(
        `https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements`,
      payload,
      {
        headers: {
            'X-API-KEY': apiKey
        },
      }
    );
    const postId = response.data.id;

  
    try {
      const response = await axios.get(`https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements/${postId}/versions/last/fields`, {
        headers: {
          'X-API-KEY': apiKey
        }
      });
    
      const existingFields = response.data.fields;
    
      // Extract the list of fields into an array of dictionaries
      const fieldsList = existingFields.map(field => ({
        uuid: field.uuid,
        placeholder: field.placeholder,
        values: field.values || []
      }));
    
      const uuidList = fieldsList.map(field => field.uuid);
    
      const fieldValueMap = {
        'Payment Frequency': paymentfrequency,
        'Clientlocation': clientlocation,
        'Clientfullname': contracttitle,
        'Service Fee': servicefee
        // Add more placeholder-value mappings as needed
      };
    
      const updatedFieldValues = fieldsList.map(field => ({
        uuid: field.uuid,
        values: [fieldValueMap[field.placeholder]]
      }));
    
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
    
      try {
        const updateResponse = await axios.patch(`https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements/${postId}/versions/last/fields`, fieldData, {
          headers: {
            'X-API-KEY': apiKey
          }
        });
        console.log('Field values updated:', updateResponse.data);
      } catch (updateError) {
        console.error('Error updating field values:', updateError.response.data);
      }
    
      try {
        await axios.post(`https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements/${postId}/members`, payloadr, {
          headers: {
            'X-API-KEY': apiKey
          },
        });
      } catch (error) {
        console.error('Error adding members:', error.response.data);
      }
    } catch (error) {
      console.error('Error fetching field data:', error.response.data);
    }



      await app.client.chat.postMessage({
        token: context.botToken,
        channel: "U04L7KS51U5",
        text: "The contract you created was just approved by your team lead ",
      });
    
    
  } catch (error) {
    console.error(error);
  }
});

app.action('reject_contract', async ({ ack, body, context, client }) => {
  try {
    // Acknowledge the action request
    await ack();
    const userId = body.user.id;
    console.log(userId)

    // Update the Slack message with the task rejection status
    await app.client.chat.postMessage({
        token: context.botToken,
        channel: "U04L7KS51U5",
        text: "The contract you created was just rejected by your team lead ",
      });
  } catch (error) {
    console.error('Error occurred:', error);
  }
});
 

// Event listener for message events
app.event('app_mention', async ({ event, context, client, say }) => {
  try {
    await say({
      
      "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Thanks for the mention <@${event.user}>! Here are the buttons to perform various exclusive functions`
        }},
          {"type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Search for any document",
                "emoji": true
              },
              "value": "first_button",
              "action_id": "first_button"
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Terminate a contract",
                "emoji": true
              },
              "value": "second_button",
              "action_id": "second_button"
            }, {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Ammend a contract",
                "emoji": true
              },
              "value": "third_button",
              "action_id": "third_button"
            },
            
           
          ]}
        
        
      
    
      
       
    ]});
  }
  catch (error) {
    console.error(error);
  }
});


async function fetchData() {
  try {
    // Define the API endpoint and organization ID
    const apiEndpoint = 'https://api.concordnow.com/api/rest/1/organizations/1018273/agreements';
    const organizationId = 1018273;
     
    // Set the query parameters
    const queryParams = {
      organization: organizationId,
      type: 'NEGOTIATION',
      limit: 10,
      trashed: false,
      accessFromRole: false,
      search: 'NDA',
    };

    // Make the API request
    const response = await axios.get(apiEndpoint, {
      params: queryParams,
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    const agreements = response.data;
    return agreements;
  } catch (error) {
    console.error('Error occurred:', error.message);
    throw error;
  }
}

  

app.action('first_button', async ({ ack, body, context, client }) => {
  try {
    // Acknowledge the action request
    await ack();
    
      // Acknowledge the action request
      
       
      const data = await fetchData();
       
      const options = data.map((item) => ({
        text: {
          type: 'plain_text',
          text: item.metadata.title,
        },
        value: item.uid,
      }));
       
      const userId = body.user.id;
       
      // console.log(options)
  

    // Update the Slack message with the task rejection status
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'contract_search',
        title: {
          type: 'plain_text',
          text: 'Search For Your Contract',
        },
        blocks: [
					{
						"type": "input",
						"block_id": "query",
						"hint": {"type": "plain_text", "text": "You can enter the keywords of the document you are looking for"},
						"label": {"type": "plain_text", "text": "What are you looking for?"},
						"element": {
							"type": "static_select",
							"action_id": "searchfunction_input",
              "options": options
						},
           
            
					}
				], 
        submit: {
          type: 'plain_text',
          text: 'Submit',
           
        },
      },
    });

     


     
  } catch (error) {
    console.error('Error occurred:', error);
  }
});

app.action('second_button', async ({ ack, body, context, client }) => {
  try {
    // Acknowledge the action request
    await ack();
    
      // Acknowledge the action request
       
      const data = await fetchData();
      console.log(data)
       
      const options = data.map((item) => ({
        text: {
          type: 'plain_text',
          text: item.metadata.title,
        },
        value: item.uid,
      }));
       
      const userId = body.user.id;
       
      // console.log(options)
  

    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'contract_terminate',
        title: {
          type: 'plain_text',
          text: 'Search For Your Contract',
        },
        blocks: [
					{
						"type": "input",
						"block_id": "query",
						"hint": {"type": "plain_text", "text": "You can enter the name of the contract you want to terminate"},
						"label": {"type": "plain_text", "text": "What contract do you want to terminate?"},
						"element": {
							"type": "static_select",
							"action_id": "terminatefunction_input",
              "options": options
						},  
					}
				], 
        submit: {
          type: 'plain_text',
          text: 'Submit',
           
        },
      },
    });  
  } catch (error) {
    console.error('Error occurred:', error);
  }
});

app.action('third_button', async ({ ack, body, context, client }) => {
  try {
    // Acknowledge the action request
     await ack();
    
      // Acknowledge the action request
       
      const data = await fetchData();
      console.log(data)
       
      const options = data.map((item) => ({
        text: {
          type: 'plain_text',
          text: item.metadata.title,
        },
        value: item.uid,
      }));
       
      const userId = body.user.id;
       
      // console.log(options)
  

    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'contract_ammend',
        title: {
          type: 'plain_text',
          text: 'Search For Your Contract',
        },
        blocks: [
					{
						"type": "input",
						"block_id": "query",
						"hint": {"type": "plain_text", "text": "You can enter the name of the contract you want to ammend"},
						"label": {"type": "plain_text", "text": "What contract do you want to ammend?"},
						"element": {
							"type": "static_select",
							"action_id": "ammendfunction_input",
              "options": options
						},  
					}
				], 
        submit: {
          type: 'plain_text',
          text: 'Submit',
           
        },
      },
    });  
  } catch (error) {
    console.error('Error occurred:', error);
  }
});


async function getContractPdf(organizationId, agreementUid) {
  try {
    const apiUrl = `https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements/${agreementUid}.pdf`;

    // Make a GET request to retrieve the PDF
    const response = await axios({
      method: 'get',
      url: apiUrl,
      responseType: 'stream',  
      headers: {
        'X-API-KEY': apiKey
      },
    });

    // Create a Readable stream from the response data
    const pdfStream = new Readable();
    pdfStream._read = () => {}; // No-op function, as the stream will be pushed manually

    // Push the data chunks from the response stream to the PDF stream
    response.data.on('data', (chunk) => pdfStream.push(chunk));
    response.data.on('end', () => pdfStream.push(null)); // Signal the end of the stream

    return pdfStream;
  } catch (error) {
    console.error('Error retrieving PDF:', error);
    throw error;
  }
}

app.view('contract_search', async ({ ack, body,view, context, client }) => {
  try {
    // Acknowledge the action
    await ack();


    // Get the selected value from the payload
    const contract_Uid = view.state.values.query.searchfunction_input.selected_option.value
    const contract_name = view .state.values.query.searchfunction_input.selected_option.text.text
    const pdfData = await getContractPdf(organizationId, contract_Uid)
    console.log(pdfData)
    // const contractName = pdfData.metadata.title;

    
       
    // Retrieve the user who triggered the action
    const userId = body.user.id;
 
     // Upload the PDF file as a Slack file attachment
     const uploadResult = await app.client.files.upload({
      token: context.botToken,
      channels: userId,
      filename: `${contract_name}.pdf`,
      file: pdfData,
    });

    console.log('PDF uploaded successfully!', uploadResult);
   
    console.log("Hello World")
    const updatedView = {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Updated Modal Title'
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Thanks for submitting the form!'
          }
        }
      ]
    };

    
      await app.client.views.update({
        token: process.env.SLACK_BOT_TOKEN,
        view_id: body.view.id,
        hash: body.view.hash,
        view: updatedView,
        response_action: 'update'
      });
  } catch (error) {
    console.error('Error handling external_select action:', error);
  }
});

app.view('contract_ammend', async ({ ack, body,view, context, client }) => {
  try {
    // Acknowledge the action
    await ack();


    // Get the selected value from the payload
    const contract_Uid = view.state.values.query.ammendfunction_input.selected_option.value
    const contract_name = view .state.values.query.ammendfunction_input.selected_option.text.text   
    const userId = body.user.id;
     
    const updatedView = {
      private_metadata: contract_Uid,
      type: 'modal',
      callback_id: 'send_ammend',
      title: {
        type: 'plain_text',
        text: 'Updated Modal Title'
      },
      blocks: [
        {
          type: 'input',
          block_id: 'document_title',
          element: {
            type: 'plain_text_input',
            action_id: 'document_title_input',
          },
          label: {
            type: 'plain_text',
            text: 'What is the title of this document',
          },
        },
       
        {
          type: 'input',
          block_id: 'client_location',
          element: {
            type: 'plain_text_input',
            action_id: 'contract_type_input',
          },
          label: {
            type: 'plain_text',
            text: 'What is the Client Location',
          },
        },
          
        {
          type: 'input',
          block_id: 'payment_frequency',
          element: {
            type: 'plain_text_input',
            action_id: 'payment_frequency_input',
          },
          label: {
            type: 'plain_text',
            text: 'What is the Payment Frequency',
          },
        },
          
         
          
        {
          type: 'input',
          block_id: 'service_fee',
          element: {
            type: 'plain_text_input',
            action_id: 'service_fee_input',
          },
          label: {
            type: 'plain_text',
            text: 'What is the Service fee',
          },
        },
        {
          "type": "input",
          "block_id": "party_a",
          "label": {
            "type": "plain_text",
            "text": "Enter your email address"
          },
          "element": {
            "type": "plain_text_input",
            "action_id": "party_a_input",
            "placeholder": {
              "type": "plain_text",
              "text": "example@example.com"
            }
          }
        },
      ],
      submit: {
        type: 'plain_text',
        text: 'Submit',
         
      }
    };

    await client.views.update({
      view_id: view.id,
      hash: view.hash,
      view: updatedView
    });

  } catch (error) {
    console.error('Error handling external_select action:', error);
  }
});




async function updateAgreementStatus(organizationId,contractUid) {
  const queryparams = {
    "status": "BROKEN"
  };

  try {
    await axios.patch(`https://api.concordnow.com/api/rest/1/organizations/${organizationId}/agreements/${contractUid}`, queryparams, {
      headers: {
         'X-API-KEY': apiKey
      }
    });
    
    console.log("Agreement status updated successfully!");
  } catch (error) {
    console.error("Failed to update agreement status:", error);
  }
}


app.view('contract_terminate', async ({ ack, body, view, context, client }) => {
  try {
    // Acknowledge the action
    await ack();
    
    const contract_Uid = view.state.values.query.terminatefunction_input.selected_option.value;
  
    updateAgreementStatus(organizationId, contract_Uid);

    const updatedView = {
      private_metadata: contract_Uid,
      type: 'modal',
      callback_id: 'send_termination',
      title: {
        type: 'plain_text',
        text: 'Updated Modal Title'
      },
      blocks: [
        {
          type: 'input',
          block_id: 'email_address',
          element: {
            type: 'plain_text_input',
            action_id: 'email_address_input',
          },
          label: {
            type: 'plain_text',
            text: 'Enter the Email address of the Person whose contract is to be terminated',
          },
        },
        {
          type: 'input',
          block_id: 'termination_date',
          element: {
            type: 'datepicker',
            action_id: 'terminationdate_input',
          },
          label: {
            type : "plain_text",
            text: 'Enter the termination Date',
          },
        },
        {
          type: 'input',
          block_id: 'lastworkingday',
          element: {
            type: "datepicker",
            action_id: 'lastworkingday_input',
          },
          label: {
            type: "plain_text",
            text: 'Enter the Last working day',
          },
        },
        {
          type: 'input',
          block_id: 'reasons',
          element: {
            type: 'plain_text_input',
            action_id: 'reasons_input',
            // multiline: true
          },
          label: {
            type: 'plain_text',
            text: 'Enter the reasons for the termination',
          },
        },
      ],
      submit: {
        type: 'plain_text',
        text: 'Submit',
         
      }
    };

    await client.views.update({
      view_id: view.id,
      hash: view.hash,
      view: updatedView
    });

     

     

  } catch (error) {
    console.error(error);
  }
});

app.view('send_termination', async ({ ack, body, view, context, client }) => {
  try {
    // Acknowledge the action
    await ack();

     

    // Extract information from the updated view
    // const userInput = view.state.values.renumeration.renumeration_input.value;;
    const contract_Uid =  view.private_metadata
    const terminationdate=view.state.values.termination_date.terminationdate_input.selected_date;
    const lastworking=view.state.values.lastworkingday.lastworkingday_input.selected_date;
    const reasons=view.state.values.reasons.reasons_input.value;
    const newEmailAddress = view.state.values.email_address.email_address_input.value;
     

     
      payloadr.invitations[newEmailAddress] = payloadr.invitations['adiobusrat@gmail.com'];
      delete payloadr.invitations['adiobusrat@gmail.com'];
       
      console.log(payloadr.invitations)
       
      console.log(newEmailAddress)
     
 
    try {
      const response = await axios.get(`https://api.concordnow.com/api/rest/1/organizations/1018273/agreements/${contract_Uid}/versions/last/fields`, {
        headers: {
          'X-API-KEY': apiKey
        }
      });
    
      const oldexistingFields = response.data.fields;
    
      let clientLocationValues;
    
      // Iterate over the fields array
      for (const field of oldexistingFields) {
        if (field.placeholder === "Clientfullname") {
          // Found the object with placeholder "Clientlocation"
          // Access the values key
          clientLocationValues = field.values;
          break; // Exit the loop since we found the desired object
        }
      }
    
      const new_item = clientLocationValues[0];
      console.log(new_item);
      console.log(terminationdate)
      console.log(lastworking)
      payloadt["title"]=`${new_item}_Termination_Contract,`
      const agreementResponse = await axios.post(
        `https://api.concordnow.com/api/rest/1/organizations/1018273/agreements`,
        payloadt,
        {
          headers: {
            'X-API-KEY': apiKey
          },
        }
      );
      const postId = agreementResponse.data.id;
      console.log(postId);
    
      const fieldsResponse = await axios.get(`https://api.concordnow.com/api/rest/1/organizations/1018273/agreements/${postId}/versions/last/fields`, {
        headers: {
          'X-API-KEY': apiKey
        }
      });
      const existingFields = fieldsResponse.data.fields;
      const fieldsList = existingFields.map(field => ({
        uuid: field.uuid,
        placeholder: field.placeholder,
        values: field.values || []
      }));
    
      const fieldValueMap = {
        'EmployeeName': new_item,
        'Termination Date': terminationdate,
        'Last working Date': lastworking,
        'Reasons': reasons
        // Add more placeholder-value mappings as needed
      };
      const updatedFieldValues = fieldsList.map(field => ({
        uuid: field.uuid,
        values: [fieldValueMap[field.placeholder]]
      }));
      const fieldData = {
        fields: []
      };
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
      console.log(postId);
    
      const patchResponse = await axios.patch(
        `https://api.concordnow.com/api/rest/1/organizations/1018273/agreements/${postId}/versions/last/fields`,
        fieldData,
        {
          headers: {
            'X-API-KEY': apiKey
          }
        }
      );
    
      await axios.post(
        `https://api.concordnow.com/api/rest/1/organizations/1018273/agreements/${postId}/members`,
        payloadr,
        {
          headers: {
            'X-API-KEY': apiKey
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
    

    

    // Send a response message
    await client.chat.postMessage({
      channel: body.user.id,
      text: `Thank you for submitting the termination form, A termination letter has been sent to the respondent`
    });
  } catch (error) {
    console.error(error);
  }
});

app.view('send_ammend', async ({ ack, body, view, context, client }) => {
  try {
    // Acknowledge the action
    await ack();
     
      const contract_Uid =  view.private_metadata
      const contracttitle=view.state.values.document_title.document_title_input.value;
      const clientlocation=view.state.values.client_location.contract_type_input.value;
      const paymentfrequency=view.state.values.payment_frequency.payment_frequency_input.value;
      const servicefee=view.state.values.service_fee.service_fee_input.value;
      const newEmailAddress = view.state.values.party_a.party_a_input.value;

    payloadt["title"] = contracttitle
      payloadr.invitations[newEmailAddress] = payloadr.invitations["adiobusrat@gmail.com"]
      delete payloadr.invitations["adiobusrat@gmail.com"]
       
      console.log(payloadd.email.value)
      console.log(contract_Uid)
      console.log(contracttitle)
      console.log(newEmailAddress)
     
 
      async function fetchData() {
        try {
          const response = await axios.get(`https://api.concordnow.com/api/rest/1/organizations/1018273/agreements/${contract_Uid}/versions/last/fields`, {
            headers: {
              'X-API-KEY': apiKey
            }
          });
      
          const existingFields = response.data.fields;
          const fieldsList = existingFields.map(field => ({
            uuid: field.uuid,
            placeholder: field.placeholder,
            values: field.values || []
          }));
      
          const fieldValueMap = {
            'Payment Frequency': paymentfrequency,
            'Clientlocation': clientlocation,
            'Clientfullname': contracttitle,
            'Service Fee': servicefee
            // Add more placeholder-value mappings as needed
          };
          const updatedFieldValues = fieldsList.map(field => ({
            uuid: field.uuid,
            values: [fieldValueMap[field.placeholder]]
          }));
          const fieldData = {
            fields: []
          };
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
      
          await axios.patch(
            `https://api.concordnow.com/api/rest/1/organizations/1018273/agreements/${contract_Uid}/versions/last/fields`,
            fieldData,
            {
              headers: {
                'X-API-KEY': apiKey
              }
            }
          );
      
          const response2 = await axios.post(
            `https://api.concordnow.com/api/rest/1/organizations/1018273/agreements/${contract_Uid}/signature/request`,
            {
              headers: {
                'X-API-KEY': apiKey
              },
            }
          );
          
        } catch (error) {
          console.error(error);
        }
      }
      
      fetchData();
      
    

    // Send a response message
    await client.chat.postMessage({
      channel: body.user.id,
      text: `Thank you for ammending the contract`
    });
  } catch (error) {
    console.error(error);
  }
});

 
//Start the app

  
  (async () => {
     await app.start(process.env.PORT || 3000);
     console.log('App is running!');
  })();