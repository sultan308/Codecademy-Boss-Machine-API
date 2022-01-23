const minionsRouter = require('express').Router();

const { 
    addToDatabase,
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
  } = require('./db');

  const workRouter = require('./workRouter');



const validateMinionData = (req,res,next) => {

    let minionData = req.body;
    minionData.salary = Number(minionData.salary);

    if( (typeof(minionData.name) === 'string') &&
        (typeof(minionData.title) === 'string') &&
        (typeof(minionData.salary) === 'number') )
    {
        req.minionData = minionData; 
        next();
    }
    else
    {
        res.status(400).send("Invalid minion Object");
    }
}

minionsRouter.param('minionId', (req,res,next,id) => {

    let minion = getFromDatabaseById('minions',id);
    
    if(minion)
    {
        req.minion = minion;
        next();
    }
    else
    {
        res.status(404).send('Minion does not eixist');
    }

})

minionsRouter.use('/:minionId/work',workRouter)

minionsRouter.get('/',(req,res,next) =>{
    res.send(getAllFromDatabase('minions'));
});

minionsRouter.post('/',validateMinionData,(req,res,next) =>{
    let newMinion = addToDatabase('minions',req.minionData);
    res.status(201).send(newMinion);
});

minionsRouter.get('/:minionId',(req,res,next) => res.send(req.minion) );

minionsRouter.put('/:minionId',validateMinionData,(req,res,next) => {
    
    req.minion.name = req.minionData.name ;
    req.minion.title = req.minionData.title ;
    req.minion.salary = req.minionData.salary ;

    res.send(updateInstanceInDatabase('minions',req.minion));

});

minionsRouter.delete('/:minionId',(req,res,next) => {
    deleteFromDatabasebyId('minions',req.minion.id)
    res.status(204).send('Deleted');
});

module.exports = minionsRouter;