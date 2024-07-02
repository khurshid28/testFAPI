// who_created {"role":"Admin","id":2 ,"date":2022-08-04T04:02:10.909Z }
// who_edited [{"role":"Admin","id":2,"date":2022-08-04T04:02:10.909Z,"to":"working","from":"blocked" }]
// who_deleted {"role":"Admin","id":2,"date" : 2022-08-04T04:02:10.909Z }
// products '[{"name":"iphone 12","price":4100000},{"name":"iphone 12","price":4780000}]'
// location='{"lat":41.20499,"long":69.11922}'
// device='{"id":"1223","model":"SAMSUNG 21s"}'
// "address":{"region":"Toshkent","city":"Yunusobod","home":"Akmalpo'lat 17"}
// expired_months : [
  //           {
  //             "month":12,
  //             "percent":41
  //         },
  //         {
  //             "month":9,
  //             "percent":39
  //         }
  //  ]


  
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
  };
  
  
  let createDB = `CREATE DATABASE IF NOT EXISTS premiumdb;`;
  let createZayavkaTable = `CREATE TABLE IF NOT EXISTS Zayavka  (
      id int PRIMARY KEY AUTO_INCREMENT,
      merchant_id int,
      fillial_id int,
      user_id int,
      fullname varchar(255),
      phoneNumber varchar(255),
      phoneNumber2 varchar(255),
      cardNumber varchar(255),
      passport varchar(255),
      passport_date varchar(255),
      passport_by varchar(255),
      address JSON,
      region_id int,
      status ENUM("progress","canceled_by_scoring","canceled_by_client","canceled_by_daily","finished","confirmed","uncorfirmed","paid") DEFAULT "progress",
      canceled_reason varchar(255),
      device JSON,
      location JSON,
      products JSON,
      amount DOUBLE(10,2),
      max_amount DOUBLE(10,2),
      payment_amount DOUBLE(10,2),
      expired_month int,
      created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      finished_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      bank varchar(255) DEFAULT "Davr",
      selfie varchar(255),
      agree BOOLEAN,
      step int DEFAULT 1,
      scoring_start TIMESTAMP NULL,
      scoring_end TIMESTAMP NULL,
      paid_status  ENUM("no_value","waiting","paid","canceled") DEFAULT "no_value",
      term JSON

  )  `;

  let createTestZayavkaTable = `CREATE TABLE IF NOT EXISTS TestZayavka  (
    id int PRIMARY KEY AUTO_INCREMENT,
    merchant_id int,
    fillial_id int,
    user_id int,
    fullname varchar(255),
    phoneNumber varchar(255),
    phoneNumber2 varchar(255),
    cardNumber varchar(255),
    passport varchar(255),
    passport_date varchar(255),
    passport_by varchar(255),
    address JSON,
    region_id int,
    status ENUM("progress","canceled_by_scoring","canceled_by_client","canceled_by_daily","finished","confirmed","uncorfirmed","paid") DEFAULT "progress",
    canceled_reason varchar(255),
    device JSON,
    location JSON,
    products JSON,
    amount DOUBLE(10,2),
    max_amount DOUBLE(10,2),
    payment_amount DOUBLE(10,2),
    expired_month int,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bank varchar(255) DEFAULT "Davr",
    selfie varchar(255),
    agree BOOLEAN,
    step int DEFAULT 1,
    scoring_start TIMESTAMP NULL,
    scoring_end TIMESTAMP NULL,
    paid_status  ENUM("no_value","waiting","paid","canceled") DEFAULT "no_value",
    term JSON

)  `;
  // "ENGINE=InnoDB DEFAULT CHARSET=utf8;"
  
  let createMerchantTable = `CREATE TABLE IF NOT EXISTS merchant  (
      id int PRIMARY KEY AUTO_INCREMENT,
      name varchar(255),
      work_status ENUM("working","blocked","super_blocked","deleted") default "working",
      type ENUM("MERCHANT","AGENT") default "MERCHANT",
      
      created_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
      admin_id int,
      
      who_created JSON,
      who_edited JSON,
      who_deleted JSON

  );`;
  
  let createFillialTable = `CREATE TABLE IF NOT EXISTS fillial  (
      id int PRIMARY KEY AUTO_INCREMENT,
      name varchar(255),
      work_status ENUM("working","blocked","super_blocked","deleted") default "working",
      created_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
      address JSON,
      merchant_id int,
      admin_id int,
      who_created JSON,
      who_edited JSON,
      who_deleted JSON,
      nds varchar(255),
      hisob_raqam varchar(255),
      bank_name varchar(255),
      mfo varchar(255),
      inn varchar(255),
      director_name varchar(255),
      director_phone varchar(255),
      percent_type ENUM("IN","OUT") default "OUT",
      expired_months JSON

  );`;
  
  let createSuperAdminTable = `CREATE TABLE IF NOT EXISTS SuperAdmin  (
      id int PRIMARY KEY AUTO_INCREMENT,
      loginName varchar(255),
      loginPassword varchar(255),
      fullName varchar(255),
      created_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
      work_status ENUM("working","blocked","super_blocked","deleted") default "working",
      age int,
      gender ENUM("ERKAK","AYOL") default "ERKAK",
      phoneNumber varchar(255),
      role varchar(255) default "SuperAdmin"
  );`;
  
  let createAdminTable = `CREATE TABLE IF NOT EXISTS Admin  (
      id int PRIMARY KEY AUTO_INCREMENT,
      loginName varchar(255),
      loginPassword varchar(255),
      fullName varchar(255),
      created_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
      work_status ENUM("working","blocked","super_blocked","deleted") default "working",
      phoneNumber varchar(255),
      role varchar(255) default "Admin",
      merchant_id int

  );`;
  let createFillialAdminTable = `CREATE TABLE IF NOT EXISTS FillialAdmin  (
    id int PRIMARY KEY AUTO_INCREMENT,
    fillial_id int,
    loginName varchar(255),
    loginPassword varchar(255),
    fullName varchar(255),
    created_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    work_status ENUM("working","blocked","super_blocked","deleted") default "working",
    phoneNumber varchar(255),
    role varchar(255) default "FillialAdmin",
    merchant_id int
);`;


  
  let createUserTable = `CREATE TABLE IF NOT EXISTS User  (
      id int PRIMARY KEY AUTO_INCREMENT,
      loginName varchar(255),
      loginPassword varchar(255),
      fullName varchar(255),
      work_status ENUM("working","blocked","super_blocked","deleted") default "working",
      phoneNumber varchar(255),
      role varchar(255) default "User",
      image LONGTEXT,
      fillial_id int,
      merchant_id int,
      age int,
      gender ENUM("ERKAK","AYOL") default "ERKAK",
      address JSON,
      who_created JSON,
      who_edited JSON,
      who_deleted JSON
  );`;
  
  let createCallCenterTable = `CREATE TABLE IF NOT EXISTS CallCenter  (
      id int PRIMARY KEY AUTO_INCREMENT,
      loginName varchar(255),
      loginPassword varchar(255),
      fullName varchar(255),
      created_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
      work_status ENUM("working","blocked","super_blocked","deleted") default "working",
      age int,
      gender ENUM("ERKAK","AYOL") default "ERKAK",
      phoneNumber varchar(255),
      image LONGTEXT,
      role varchar(255) default "CallCenter"
  );`;
  
  let createAccountantTable = `CREATE TABLE IF NOT EXISTS Accountant  (
      id int PRIMARY KEY AUTO_INCREMENT,
      loginName varchar(255),
      loginPassword varchar(255),
      fullName varchar(255),
      created_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
      work_status ENUM("working","blocked","super_blocked","deleted") default "working",
      phoneNumber varchar(255),
      image LONGTEXT,
      role varchar(255) default "Accountant"
  );`;
  
  let getZayavka = `SELECT * FROM Zayavka`;
  let getUser = `SELECT * FROM User`;
  let getSuperAdmin = `SELECT * FROM SuperAdmin`;
  let getAdmin = `SELECT * FROM Admin`;
  let getFillialAdmin = `SELECT * FROM FillialAdmin`;
  let getCallCenter = `SELECT * FROM CallCenter`;
  let getAccountant = `SELECT * FROM Accountant`;
  let getMerchant = `SELECT * FROM Merchant`;
  let getFillial = `SELECT * FROM Fillial`;
  
  
  let update1Zayavka = `INSERT INTO Zayavka (user_id) VALUES (17) ; `; // passport and birthdate page
  let update2Zayavka = `UPDATE Zayavka SET step=2,fullname='Xurshid Ismoilov 2',phoneNumber ='+998950642827',phoneNumber2 ='+998950642827',cardNumber='986014******0006' WHERE id = 1;`; // my id data page
  let update3Zayavka = `UPDATE Zayavka SET step=3 WHERE id = 1;`; // to bank for scoring  // selfie with passport
  // let update4Zayavka = `UPDATE Zayavka SET step=4 WHERE id = 1;`; // from bank [yes,no] // loading page
  let update5Zayavka = `UPDATE Zayavka SET step=5,agree = TRUE WHERE id = 1;`; //  oferta page
  let update6Zayavka = `UPDATE Zayavka SET step=6,products ='[{"name":"iphone 12","price":4100000},{"name":"iphone 12","price":4780000}]',location='{"lat":41.20499,"long":69.11922}',device='{"id":"1223","model":"SAMSUNG 21s"}' WHERE id = 1;`; // products page
  let update7Zayavka = `UPDATE Zayavka SET step=7,amount=1000000,payment_amount=1410000,expired_month = 12 WHERE id = 1;`; // to bank in last request,for oformeleniya  // grafik page
  let updateFinishZayavka = `UPDATE Zayavka SET step=8,selfie='/9vashgdsagh',status = 'finished',finished_time = CURRENT_TIMESTAMP WHERE id = 1;`; // for selfie to our server  // selfie with tilhat page

  let cancelByClientZayavka = `UPDATE Zayavka SET status = 'canceled_by_client', finished_time = CURRENT_TIMESTAMP,canceled_reason='procent is too high' WHERE id = 1`;
  let cancelByScoringZayavka = `UPDATE Zayavka SET status = 'canceled_by_scoring', finished_time = CURRENT_TIMESTAMP,canceled_reason='canceled by scoring' WHERE id = 1`;
  
  let dropZayavkeTable = `DROP TABLE Zayavka;`;
  let dropUserTable = `DROP TABLE User;`;
  
  function update1ZayavkaFunc(data) {
    let { user_id } = data;
    return `INSERT INTO Zayavka (user_id) VALUES (${user_id}) ; `;
  }
  
  function update2ZayavkaFunc(data) {
    let { id, fullname, phoneNumber, phoneNumber2, cardNumber } = data;
    fullname =`${fullname}`
    fullname =fullname.replaceAll("ʻ", "'")
    return `UPDATE Zayavka SET step=2,fullname=?,phoneNumber =?,phoneNumber2 =?,cardNumber=? WHERE id = ${id};`;
  }
  
  function update3ZayavkaFunc(data) {
    let { id } = data;
    return `UPDATE Zayavka SET step=3 WHERE id = ${id};`;
  }
  
  // function update4ZayavkaFunc(data) {
  //   let { id } = data;
  //   return `UPDATE Zayavka SET step=4 WHERE id = ${id};`;
  // }
  
  function update5ZayavkaFunc(data) {
    let { id } = data;
    return `UPDATE Zayavka SET step=5,agree = TRUE WHERE id = ${id};`;
  }
  
  function update6ZayavkaFunc(data) {
    let { id, products, location, device } = data;   
    let productsString =`'[`;
    products.forEach(product => {
      productsString+= (toMyString(product).slice(1, -1) )
      productsString+=`,`
    });
    productsString = productsString.slice(0,-1)
    productsString+="]'"
    console.log(productsString);
    return `UPDATE Zayavka SET step=6,products=${productsString},location=${toMyString(location)},device=${toMyString(device)} WHERE id = ${id};`;
  }
  
  function update7ZayavkaFunc(data) {
    let { id, amount, payment_amount, expired_month } = data;
    return `UPDATE Zayavka SET step=7,amount=${amount},payment_amount=${payment_amount},expired_month = ${expired_month} WHERE id = ${id};`;
  }
  
  function updateFinishZayavkaFunc(data) {
    let { id, selfie } = data;
    return `UPDATE Zayavka SET step=8,selfie='${selfie}',status = 'finished',finished_time = CURRENT_TIMESTAMP WHERE id = ${id};`;
  }
  
  function cancelByScoringZayavkaFunc(data) {
    let { id } = data;
    return `UPDATE Zayavka SET status = 'canceled_by_scoring', finished_time = CURRENT_TIMESTAMP,canceled_reason='canceled by scoring' WHERE id = ${id}`;
  }
  
  function cancelByClientZayavkaFunc(data) {
    let { id, canceled_reason } = data;
    return `UPDATE Zayavka SET status = 'canceled_by_client', finished_time = CURRENT_TIMESTAMP,canceled_reason='${canceled_reason}' WHERE id = ${id}`;
  }

  
  
  function getZayavkaFunc(data) {
      let {id} = data;
      return `SELECT * FROM Zayavka WHERE id=${id}`;
  }
  
  function getZayavkaFuncByUser(data) {
      let {user_id} = data;
      return `SELECT * FROM Zayavka WHERE user_id = ${user_id}`;
  }
  
  
  function insertUserFunc(data) {
    //   let {
    //     fullName,
    //     loginName,
    //     loginPassword,
    //     phoneNumber,
    //     merchant_id,
    //     fillial_id,
    //     image,
    //     gender,
    //     address,
    //     who_created,
    //   } = data;
  
    let KEYS = [];
    let VALUES = [];
    console.log(VALUES);
    for (let [key, value] of Object.entries(data)) {
      KEYS.push(`${key}`);
  
      if (key != "address" && key != "who_created") {
        value = `${value}`;
        value = value.replaceAll("ʻ", "'");
        // VALUES.push(`"${value}"`);
        VALUES.push(value)
      } else {
        VALUES.push(toMyString(value));
      }
    }
    console.log(">>>>");
    // console.log(KEYS.join());
    console.log(">>>>");
    console.log(VALUES);
    return `INSERT INTO User (${KEYS.join()}) VALUES (${VALUES.map(function (val, index) {
      return "?";
  }).join(",") }`,[...(VALUES)];
  }
  
  
  
  
  let insertUser = `INSERT INTO User (fullname) VALUES('Khurshid User')`;
  let insertSuperAdmin = `INSERT INTO SuperAdmin (fullname) VALUES('Khurshid SuperAdmin') ; `;
  let insertAdmin = `INSERT INTO Admin (fullname) VALUES('Khurshid Admin') ; `;
  let insertCallCenter = `INSERT INTO CallCenter (fullname) VALUES('Khurshid CallCenter') ; `;
  let insertAccountant = `INSERT INTO Accountant (fullname) VALUES('Khurshid Accountant') ;`;
  let insertMerchant = `INSERT INTO Merchant (name) VALUES('Artel'); `;
  let insertFillial = `INSERT INTO Fillial (name) VALUES('Chilonzor fillial') ; `;
  
  module.exports.PREMIUM = {
    createDB,
  
    createSuperAdminTable,
    createAdminTable,
    createFillialAdminTable,
    createUserTable,
    createCallCenterTable,
    createAccountantTable,
    createZayavkaTable,
    createTestZayavkaTable,
    createMerchantTable,
    createFillialTable,
  
    getZayavka,
    getUser,
    getSuperAdmin,
    getAdmin,
    getCallCenter,
    getAccountant,
    getMerchant,
    getFillial,
  
    insertSuperAdmin,
    insertAdmin,
    insertUser,
    insertCallCenter,
    insertAccountant,
    insertMerchant,
    insertFillial,
  
    update1Zayavka,
    update2Zayavka,
    update3Zayavka,
    // update4Zayavka,
    update5Zayavka,
    update6Zayavka,
    update7Zayavka,
    updateFinishZayavka,
    cancelByClientZayavka,
    cancelByScoringZayavka,
  
    dropZayavkeTable,
    dropUserTable,
  
    update1ZayavkaFunc,
    update2ZayavkaFunc,
    update3ZayavkaFunc,
    // update4ZayavkaFunc,
    update5ZayavkaFunc,
    update6ZayavkaFunc,
    update7ZayavkaFunc,
    updateFinishZayavkaFunc,
    cancelByClientZayavkaFunc,
    cancelByScoringZayavkaFunc,
  
    getZayavkaFunc,
    getZayavkaFuncByUser,
  
    insertUserFunc,
  };
   
  function toMyString(ob) {
    let result = `'{`;
    let li = [];
    for (let [key, value] of Object.entries(ob)) {
      value = `${value}`;
      value= value.replaceAll("ʻ", "'");
      li.push(`"${key}":"${value}"`);
    }
    result += li.join();
    if (ob.role) {
      result += `,"date": "${new Date().addHours(5).toISOString()}"`;
    }
    result = result + `}'`;
    return result;
  }
  
  
  
  
  
  