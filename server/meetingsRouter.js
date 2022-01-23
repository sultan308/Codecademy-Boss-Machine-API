const meetingsRouter = require('express').Router();

const { 
    addToDatabase,
    createMeeting,
    getAllFromDatabase,
    deleteAllFromDatabase,
  } = require('./db');

meetingsRouter.get('/',(req,res,next) => res.send(getAllFromDatabase('meetings')));

meetingsRouter.post('/',(req,res,next) => {
    let meeting = addToDatabase('meetings', createMeeting() );
    res.status(201).send(meeting);
});

meetingsRouter.delete('/',(req,res,next) => {
    deleteAllFromDatabase('meetings');
    res.status(204).send();

});

module.exports = meetingsRouter;