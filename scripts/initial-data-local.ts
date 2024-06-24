const mongoose = require('mongoose');

// Step 2: Connect to MongoDB
mongoose.connect('mongodb://olgerLabsUser:olgerLabsPass@localhost:27017/user-admin?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Step 3: Define a Schema and Model
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    avatarUrl: String
});

const roleSchema = new mongoose.Schema({
  name: String,
  description: String,
  domain: String,
  permissionIds: [String]
});

const permissionSchema = new mongoose.Schema({
  name: String,
  description: String,
  applicationName: String
});

const User = mongoose.model('User', userSchema);
const Role = mongoose.model('Role', roleSchema);
const Permission = mongoose.model('Permission', permissionSchema);


const createUsers = async () => {
  // Sample records to insert
  const records = [
    {email: 'olger@test.com', password: 'password', firstName: 'Olger', lastName: 'Alpizar', phone: '506 8888-1111', avatarUrl: 'none'},
    {email: 'ivan@test.com',  password: 'password', firstName: 'Ivan',  lastName: 'Alpizar', phone: '506 8888-2222', avatarUrl: 'none'},
    {email: 'ana@test.com',   password: 'password', firstName: 'Ana',   lastName: 'Bolanos', phone: '506 8888-3333', avatarUrl: 'none'},
    {email: 'sara@test.com',  password: 'password', firstName: 'Sara',  lastName: 'Alpizar', phone: '506 8888-4444', avatarUrl: 'none'}
  ];

  records.forEach(async x => {
    const user = new User({
      email: x.email,
      password: x.password,
      firstName: x.firstName,
      lastName: x.lastName,
      phone: x.phone,
      avatarUrl: x.avatarUrl
    });
  
    try {
        const savedUser = await user.save();
        console.log('User saved:', savedUser);
    } catch (err) {
        console.error('Error saving user:', err);
    }
  })
};

const createRoles = async () => {
  // Sample records to insert
  const records = [
    {name: 'Administrator', description: 'Super access',   domain: 'Management'},
    {name: 'ReadOnly',      description: 'Minimal access', domain: 'Management'},
    {name: 'Administrator', description: 'Super access',   domain: 'Commerce'},
    {name: 'ReadOnly',      description: 'Minimal access', domain: 'Commerce'}
  ];

  records.forEach(async x => {
    const role = new Role({
      name: x.name,
      description: x.description,
      domain: x.domain,
      permissionIds: []
    });
  
    try {
        const savedRole= await role.save()
        console.log('Role saved:', savedRole)
    } catch (err) {
        console.error('Error saving role:', err)
    }
  })
}


const createPermissions = async () => {
  // Sample records to insert
  const records = [
    {name: 'Administrator', description: 'Super access',   applicationName: 'AppTest1'},
    {name: 'ReadOnly',      description: 'Minimal access', applicationName: 'AppTest1'},
    {name: 'Administrator', description: 'Super access',   applicationName: 'AppTest2'},
    {name: 'ReadOnly',      description: 'Minimal access', applicationName: 'AppTest2'}
  ];

  records.forEach(async x => {
    const permission = new Permission({
      name: x.name,
      description: x.description,
      applicationName: x.applicationName
    });
  
    try {
        const savedPermission= await permission.save()
        console.log('Permission saved:', savedPermission)
    } catch (err) {
        console.error('Error saving permission:', err)
    }
  })
}

// Execute CRUD functions
(async () => {
  await createUsers()
  await createRoles()
  await createPermissions()
})()