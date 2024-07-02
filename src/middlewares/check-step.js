
const {
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    BadRequestError
} = require("../utils/errors.js");

let db =require("../config/db")

module.exports.default_config = async(req, res, next) => {
    try {

       if(!req.body.id){
          return   next(
            new BadRequestError(
              400,
              "You can't send request to this resource"
            )
          );
       }
      let zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from TestZayavka WHERE id=${req.body.id}`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            if (results.length != 0) {
              resolve(results[0]);
            } else {
              resolve(null);
            }
          }
        );
      });
      if(!zayavka ){
        return next(
            new NotFoundError(
              404,
              "Zayavka Not found "
            )
          );
      }
      if(zayavka.status !="progress"){
        return next(
            new NotFoundError(
              404,
              "You can't send request to this resource"
            )
          );
      }

      

       
        
        return next();
    } catch (error) {
      console.log("check step >>");
        console.log(error);
        return next(new InternalServerError(500,  error));
    }
};


class ZayavkaReq{
      async update2(req, res, next) {
        try {
    
       
          let zayavka = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from TestZayavka WHERE id=${req.body.id}`,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                if (results.length != 0) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              }
            );
          });
          if(zayavka.step !=1){
            return  next(
                new BadRequestError(
                  400,
                  "You can't send request to this resource"
                )
              );
          }
    
           
            
            return next();
        } catch (error) {
          console.log("check step >>");
            console.log(error);
            return next(new InternalServerError(500,  error));
        }
    }

    async update3(req, res, next) {
        try {
    
       
          let zayavka = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from TestZayavka WHERE id=${req.body.id}`,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                if (results.length != 0) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              }
            );
          });
          if(zayavka.step !=2){
            for (let index = 0; index < 5; index++) {
                console.log(">>>>>");
                console.log(zayavka);
                
            }
            return  next(
                new BadRequestError(
                  400,
                  "You can't send request to this resource"
                )
              );
          }
    
           
            
            return next();
        } catch (error) {
          console.log("check step >>");
            console.log(error);
            return next(new InternalServerError(500,  error));
        }
    }

    async update5_6_7_finish(req, res, next) {
        try {
    
       
          let zayavka = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from TestZayavka WHERE id=${req.body.id}`,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                if (results.length != 0) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              }
            );
          });
          if(zayavka.step <= 3 || zayavka.step>=8){
            return  next(
                new BadRequestError(
                  400,
                  "You can't send request to this resource"
                )
              );
          }
    
           
            
            return next();
        } catch (error) {
          console.log("check step >>");
            console.log(error);
            return next(new InternalServerError(500,  error));
        }
    }

    async cancel(req, res, next) {
        try {
    
       
          let zayavka = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from TestZayavka WHERE id=${req.body.id}`,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                if (results.length != 0) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              }
            );
          });
          if(zayavka.step==8){
            return  next(
                new BadRequestError(
                  400,
                  "You can't send request to this resource"
                )
              );
          }
    
           
            
            return next();
        } catch (error) {
          console.log("check step >>");
            console.log(error);
            return next(new InternalServerError(500,  error));
        }
    }


}

module.exports.ZayavkaReq = new ZayavkaReq() 