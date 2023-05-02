const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt); // promise ver.

class UsersRepository extends Repository {
  async comparePasswords(savedPw, supplied) {
    // savedPw -> pw saved in our database. 'hashed.salt'
    // supplied -> pw given by user during sign in
    // const result = savedPw.split('.');
    // const hashed = result[0]
    // const salt = result[1]
    const [hashed, salt] = savedPw.split('.');
    const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuffer.toString('hex');
  }
  async create(attributes) {
    attributes.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attributes.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attributes, // this means create new obj, take properties out of attri obj and override those existing pw to the hashed ver.
      password: `${buf.toString('hex')}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);
    return record;
  }
}

module.exports = new UsersRepository('users.json');
