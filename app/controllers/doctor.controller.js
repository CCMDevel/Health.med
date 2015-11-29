module.exports = function(){
    var Doctor = require('mongoose').model('Doctor');
    var isEmpty = require('./isEmpty.js');
    var reqError = require('./reqError.js');
    
    var c = {};
    
    c.create = function(req, res){
        if (!req.body) return reqError(res, 400, "body", "missing");

        var newDoctor = new Doctor(req.body);
        newDoctor.save(function(err){
            if (err) return reqError(res, 500, err);

            console.log(JSON.stringify({ doctor : newDoctor }) + "\n");
            res.status(201).json({
                doctor : newDoctor
            });
        });
    };

    c.byId = function(req, res, next, doctor_id){
        if (!doctor_id) return next();

        req.doctor_id = doctor_id;
        next();
    };
    
    c.doLogIn = function(req, res, next){
        if(!req.body) return reqError(res, 400, "body", "missing");
        if(!req.body.password) return reqError(res, 400, "passsword", "missing");
        if(!req.body.minc) return reqEror(res, 400, "minc", "missing");
        Doctor.findOne({ minc : req.body.minc }, function (err, doctor){
            if (err) return reqError(res, 500, err);
            
            if(doctor.password == req.body.password) {
                req.session.doctor = doctor ;
                req.session.account_type = 'doctor';
                res.json({ logged_in : true });
        } else {
            res.status(403).json({ logged_in: false });
        }
        });
    };

    c.findById = function(req, res, next, doctor_id){
        if (!doctor_id) return next();

        Doctor.findOne({ _id : doctor_id }, function(err, doctor){
            if (err) return reqError(res, 500, err);

            req.doctor = doctor;
            next();
        });
    };

    c.get = function(req, res, next){
        if (!req.doctor) return reqError(res, 400, "doctor", "missing");

        res.json(req.doctor);
    };

    c.index = function(req, res, next){
        Doctor.find({}, function(err, doctors){
            if (err) return reqError(res, 500, err);

            res.json(doctors);
        });
    };
    
    c.removeInvite = function(req, res, next){

        
        if (isEmpty(req.body)) return reqError(res, 400, "body", "missing");
        if (!req.session.doctor) return res.json({ logged_in : false });
        if (!req.body.invite) return reqError(res,400, "body.invite", "missing");
    }

    c.addInvite = function(req, res, next){
        if (isEmpty(req.body)) return reqError(res, 400, "body", "missing");
        if (!req.session.doctor) return res.json ({ logged_in : false });
        if (!req.body.invite) return reqError(res, 400, "body.invite", "missing");
        
        Doctor.update({
            _id : req.session.doctor._id
        },
     
        {
            $addToSet : {
                'invites' : req.body.invite
            }
        }, 
        function(err, newDoctor){
            if(err) return reqError(res, 500, err);
            res.status(202).json(newDoctor);
        });

    };

    // doctor-patient invites relationship controllers
    //     - called by patients 

    c.inviteDoctor = function(req, res, next){
        if (!req.session.patient) return res.status(403).json({ logged_in : false });
        if (!req.doctor_id) return reqError(res, 400, "doctor", "missing");
        
        Doctor.findOneAndUpdate({ 
            _id : req.doctor_id
        }, {
            $addToSet : {
               invites : req.session.patient._id 
            }
        }, function(err, doctor){
            if (err) return reqError(res, 500, err);
            if (!doctor) return reqError(res, 400, "doctor", "invalid");

            doctor.invites.push(req.session.patient._id);
            doctor.save(function(err){
                if (err) return reqError(res, 500, err);

                res.status(202).json({
                    invited : true
                });
            });
        });         
    }

    // doctor-patient has_access_to relationship controllers 

  //  c.addPatient = function()

// patient - doctor relation. Doctor logged in accepts patient invite
// use existing doctor.invites.remove so just add the invites

    c.addAccessTo = function(req, res, next){
        console.log('yoyo1');
        
        if(isEmpty(req.body)) return reqError(res, 400, "body", "missing");
        if(!req.body.patient_id) return reqError(res, 400, "body.patient", "missing");

   // check if it is a docotr logged in
        if((!req.session) && !(req.session.account_type === 'doctor')) return res.json({logged_in : false });
    
    //check if there is an invitation pending. if can't find it won't remove it
    //run the delete invites function??

        //need way to send back to this function that the user is present 
        //and invite was successfully removed.
        Doctor.findOneAndUpdate({
            _id: req.session.doctor._id
        },
        { 
            $addToSet : {
                'has_access_to' : req.body.patient_id
                }
        },
        function(err, newDoctor){
            if(err) return reqError(res, 500, err);
            console.log(newDoctor);
            res.status(202).json(newDoctor);
        });

    };

    c.deleteAccessTo = function(req, res, next){
        if(isEmpty(req.body)) return reqError(res, 400, "body", "missing");
        if(!req.body.patient_id) return reqError(res, 400, "body.patient", "missing");
        if(!req.session.doctor) return res.json({ logged_in : false});
        
        Doctor.findOneAndUpdate({
            _id : req.session.doctor._id
        },
        {
            $pull : { 'has_access_to' : req.body.patient_id
            }
        },
        function (err, newDoctor){
            if(err) return reqError(res, 500, err);
            console.log("yoyo 3 ");
            res.status(202).json(newDoctor);
        });
    };

    c.getAccessTo = function(req, res, next){
        if(!req.session.doctor) return res.json({ logged_in : false});
        console.log("stuff");
        console.log(req.session.doctor);
        console.log();
        Doctor.find ({_id: req.session.doctor._id})
        .populate('has_access_to')
        .exec(function(err,doctor){
            if (err) return reqError(res, 500, err);
               
            res.json(doctor);
        });
    };
    
    return c;
}

