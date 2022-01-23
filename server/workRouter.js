const workRouter = require('express').Router();

const { 
    addToDatabase,
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
    createWork,
  } = require('./db');

workRouter.param('workId',(req,res,next,id) => {
    let work = getFromDatabaseById('work',id);
    
    if(work)
    {
        if(work.minionId === req.minion.id)
        {  
            req.work = work;
            next();
        }
        else 
        {
            res.status(400).send();
        }
    }
    else
    {
        res.status(404).send('Work does not eixist');
    }
})


const validateWorkData = (req,res,next) => {
    
    let workData = req.body;

    workData.hours = Number(workData.hours);
    
    if( (typeof(workData.title) === 'string') &&
        (typeof(workData.description) === 'string') &&
        (typeof(workData.hours) === 'number') )
    {
        req.workData = workData; 
        next();
    }
    else
    {
        res.status(400).send("Invalid idea Object");
    }
}

workRouter.get('/',(req,res,next) => {
    let allWork = getAllFromDatabase('work');
    let minionWork  = allWork.filter(work => work.minionId === req.minion.id)
    res.send(minionWork);
})
workRouter.post('/',validateWorkData,(req,res,next) => {

    req.workData.minionId = req.minion.id;
    res.status(201).send(addToDatabase('work',req.workData));

})
workRouter.put('/:workId',validateWorkData,(req,res,next) => {

    req.work.title = req.workData.title;
    req.work.description = req.workData.description;
    req.work.hours = req.workData.hours;
    req.work.minionId = req.workData.minionId;

    res.send(updateInstanceInDatabase('work',req.work));

})
workRouter.delete('/:workId',(req,res,next) => {

    res.status(204).send(deleteFromDatabasebyId('work',req.work.id));
});



module.exports = workRouter;