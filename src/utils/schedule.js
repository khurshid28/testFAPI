const schedule = require("node-schedule");
let db = require("../config/db");

schedule.scheduleJob({ hour: 5, minute: 0 }, () => {
  let date = new Date(Date.now());
  console.log("Job runs every day at = " + date.toString());

  db.query(
    `Update Zayavka SET status='canceled_by_daily',canceled_reason='Автоматический',finished_time = CURRENT_TIMESTAMP WHERE status='progress';`,
    function (err, results, fields) {
      console.log(err);
      console.log("okkk");
      if (err) {
        console.log({ err });
      }
      console.log({ results });
    }
  );
});


