module.exports = function(){
    var Prescription = require('mongoose').model('Prescription');
    var Patient = require('mongoose').model('Prescription');

    var hmSession = require('./session.controller.js');

    var reqError = require('./reqError.js');
    var isEmpty = require('./isEmpty.js');
    
    var c = {};
 
    c.create = function(req, res, next){
        if (isEmpty(req.body)) return reqError(res, 400, "body", "missing");
        if (!req.session.doctor) { 
            return reqError(res, 403, {
                logged_in : false,
                msg : "not logged in as a doctor"
            });
        }

        req.body.doctor_id = req.session.doctor._id;
        
        var newPrescription = new Prescription(req.body);
        newPrescription.save(function(err){
            if (err) return reqError(res, 500, err);

            res.status(201).json({
                prescription : newPrescription
            });
        });
    };

    c.findById = function(req, res, next, prescription_id){
        if (!prescription_id) return next();

        Prescription.findOne({ _id : prescription_id }, function(err, prescription){
            if (err) reqError(res, 500, err);

            req.prescription = prescription;
            next();
        });
    };

    c.getPrescriptionsMe = function (req,res, next){
        if (!req.session.patient) { 
            return reqError(res, 403, {
                logged_in : false,
                msg : "not logged in as a patient"
            });
        }
        
        Prescription.find({ 
            "patient" : req.session.patient._id
        }, "drug_name dosage frequency doctor date")
        .populate('doctor','name_first specialization name_last')
        
        .exec(function(err, prescription){
            if (err) return reqError(res, 500, err);
               
            res.json(prescription);
        });

    };

    c.get = function(req, res, next){
        if (!req.prescription) return reqError(res, 400, "prescription", "missing");

        res.json(req.prescription);
    };

    c.index = function(req, res, next){
        Prescription.find({}, function(err, prescription){
            if (err) reqError(res, 500, err);

            res.json(prescription);
        });
    
    };

    return c;
}