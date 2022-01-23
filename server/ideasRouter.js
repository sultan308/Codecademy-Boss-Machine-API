const ideasRouter = require('express').Router();

const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const { 
    addToDatabase,
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
  } = require('./db');

  const validateIdeaData = (req,res,next) => {
    let ideaData = req.body;

    ideaData.numWeeks = Number(ideaData.numWeeks);
    ideaData.weeklyRevenue = Number(ideaData.weeklyRevenue);

    
    if( (typeof(ideaData.name) === 'string') &&
        (typeof(ideaData.description) === 'string') &&
        (typeof(ideaData.numWeeks) === 'number')  &&
        (typeof(ideaData.weeklyRevenue) === 'number') )
    {
        req.ideaData = ideaData; 
        next();
    }
    else
    {
        res.status(400).send("Invalid idea Object");
    }
}

ideasRouter.param('ideaId',(req,res,next,id) => {
    let idea = getFromDatabaseById('ideas',id);
    if(idea)
    {
        req.idea = idea;
        next();
    } 
    else
    {
        res.status(404).send('Idea does not eixist');
    }
});

ideasRouter.get('/',(req,res,next)=> res.send(getAllFromDatabase('ideas')));

ideasRouter.post('/',checkMillionDollarIdea,validateIdeaData,(req,res,next) => {
    
    let newIdea = addToDatabase('ideas',req.ideaData);
    res.status(201).send(newIdea);

});

ideasRouter.get('/:ideaId',(req,res,next) =>{
    res.send(req.idea);
})
ideasRouter.put('/:ideaId',validateIdeaData,(req,res,next) => {

    req.idea.name = req.ideaData.name;
    req.idea.description = req.ideaData.description;
    req.idea.numWeeks = req.ideaData.numWeeks;
    req.idea.weeklyRevenue = req.ideaData.weeklyRevenue;

    res.send(updateInstanceInDatabase('ideas',req.idea));
  
})

ideasRouter.delete('/:ideaId',(req,res,next) => {

    deleteFromDatabasebyId('ideas',req.idea.id);
    res.status(204).send('Deleted');
  
});

module.exports = ideasRouter;
