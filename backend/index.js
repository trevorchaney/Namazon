const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var cors = require('cors')
const jwt = require('jsonwebtoken');
const accessTokenSecret = "someSecretIJustInvented!";
const userData = require('./data/userData');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
const url = "mongodb+srv://testingUser:testingPassWord1234@shopcluster.1zdaf.mongodb.net/shop_db?retryWrites=true&w=majority";

const initDataBase = async () => {
    database = await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    if (database) {
        app.use(session({
            secret: 'ItsASecretToEveryone',
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        console.log('Succesfully connected to my DB');
    } else {
        console.log("Error connecting to my DB");
    }
}


async function initData() {
    const cartData = require('./data/cartData');
    const storeData = require('./data/storeData');
    const userData = require('./data/userData');

    await cartData.deleteMany({});
    await storeData.deleteMany({});
    await userData.deleteMany({});

    const sampleStoreItems = require('./data/sampleData/sampleStore.json');
    const sampleCarts = require('./data/sampleData/sampleCarts.json');
    const sampleUsers = require('./data/sampleData/sampleUsers.json');


    sampleStoreItems.forEach(item => {
        delete item.id;
    })
    const store = await storeData.create(sampleStoreItems);

    sampleCarts.forEach(cart => {
        delete cart.id;
        cart.cartItems.forEach(item => {
            delete item.id;
            item.storeItem = store[item.storeItemId];
            delete item.storeItemId;
        })
    })
    const carts = await cartData.create(sampleCarts);

    sampleUsers.forEach(user => {
        delete user.id;
        user.cart = carts[user.cartId];
        user.login = user.firstName + '.' + user.lastName;
        user.password = 'password123';
        delete user.cartId;
    });
    const users = await userData.create(sampleUsers);

    console.log('DB reloaded');
}

//////////////
// new JWT Route(s)

app.post('/user/login', async (req, res) => {
  console.log(req.body);
    try {
        const {login, password} = req.body;
        const user = await userData.findOne({login, password});

        if (user) {
            //User was found, create a token!
            const accessToken = jwt.sign({user}, accessTokenSecret);
            res.send({accessToken, user});
        } else {
            res.sendStatus(403);
        }
    }
    catch(e){
        return res.status(400).send(e)
    }
})


initDataBase().then(() => {
    //initData();

    // routes for 1 and 2
    app.use(require('./routes/userRoutes'));

  ///////////////
  //// app middleware to check for jwt
  // I am choosing to mount this middelware after the user routes so that.
  // The users can be created. I would think that most sites generate an email
  // or use another sites authentication (google auth.) after which the user is
  // created in the database and then the login route can serve the jwt on login.
  // To get around this I am just going to mount the middleware here.
  app.use(async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        //Bearer eyJhbGci...
        const jwtToken = authHeader.split(' ')[1];
        const user = jwt.verify(jwtToken, accessTokenSecret);
        req.userJwt = user;
      } else {
        return res.sendStatus(401);
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(403);
    }
    next();
  })

    // routes for  3
    app.use(require('./routes/cartRoutes'));

    // routes for  4
    app.use(require('./routes/storeRoutes'));

    app.listen(port);
    console.log(`listening on port ${port}`);
});
