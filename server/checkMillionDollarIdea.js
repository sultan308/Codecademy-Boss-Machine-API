const checkMillionDollarIdea = (req,res,next) => {
    let idea = req.body;
    let isValid = false;
    if(idea && idea.weeklyRevenue && idea.numWeeks)
    {
        idea.weeklyRevenue = Number(idea.weeklyRevenue);
        idea.numWeeks = Number(idea.numWeeks);

        if(( idea.weeklyRevenue * idea.numWeeks) > 999999)
        {
            isValid = true;
            next();
        }
        
    }
    if(!isValid)
    {
      res.status(400).send();  
    }
    

};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
