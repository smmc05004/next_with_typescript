import express, { Request, Response } from 'express';
import { connection } from '../connection';
import jwt from "jsonwebtoken";

const AuthRouter = express.Router();

AuthRouter.post("/user", (req: Request, res: Response) => {
  const user = req.body.user;
  const newName = user.name.replace(/(\s*)/g, "");

  const selectQuery = `
  SELECT
    * 
  FROM 
    user 
  WHERE 
    user_id = ${user.id}
  `;

  const insertQuery = `
  INSERT INTO user 
    (user_id, user_name)
  VALUES 
    ('${user.id}', '${newName}')
  `;

  connection.query(selectQuery, (selectErr, selectRes) => {
    if (selectErr) throw selectErr;

    if (selectRes && selectRes[0]) {
      res.send({ status: 500, details: "aleady exists" });
    } else {
      connection.query(insertQuery, (insertErr, insertRes) => {
        if (insertErr) throw insertErr;
        res.send(insertRes);
      });
    }
  });
});

AuthRouter.post("/login", (req: Request, res: Response) => {
  const uid = req.body.uid;

  const selectQuery = `
  SELECT
    *
  FROM
    user
  WHERE
    user_id = ${uid}
  `;

  connection.query(selectQuery, (err, queryRes) => {
    if (err) throw err;

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 604800000,
        data: queryRes[0].user_id,
      },
      "secret"
    );

    const expireDay = new Date(Date.now() + 604800000);

    res.cookie("my-cookie", token, { expires: expireDay });
    res.send(queryRes);
  });
});

AuthRouter.post("/check", (req: Request, res: Response) => {
  const token = req.body.token;

  const veriRes: any = jwt.verify(token, "secret");

  const user_id = veriRes.data;
  const selectQuery = `
  SELECT
    * 
  FROM 
    user 
  WHERE 
    user_id = ${user_id}
  `;

  connection.query(selectQuery, (err, queryRes) => {
    if (err) throw err;

    // const expireDay = new Date(Date.now() + expireTime);
    if (queryRes && queryRes[0]) {
      console.log("queryRes: ", queryRes);
    }
    res.send(veriRes);
  });
});

AuthRouter.post("/logout", (req: Request, res: Response) => {
  console.log("logtout start");
  const userId = req.body.uid;
  console.log("userId: ", userId);
  res.clearCookie("my-cookie");
  res.send({ status: 200 });
});


module.exports = AuthRouter;