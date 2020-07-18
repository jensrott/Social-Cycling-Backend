const User = require('../models/userModel');
const Post = require('../models/postModel');
const Profile = require('../models/profileModel');

const faker = require('faker');
const bcrypt = require('bcryptjs');

/** Create an array with fake user objects
 * @param {number} amountOfUsers 
 * @return {Array<Object>} Array of user objects
 */
const createUsers = (amountOfUsers) => {
    let users = [];

    for (let i = 0; i <= amountOfUsers; i++) {
        let user = {
            name: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            profilePicture: faker.image.imageUrl(),
            date: new Date(),
        }
        users.push(user);
    }
    return users;
}

exports.seedProfiles = (req, res) => {
    const users = createUsers(10);
    users.forEach((user) => {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) throw err;
            const newUser = new User({
                name: user.name,
                email: user.email,
                password: hash,
                profilePicture: user.profilePicture,
                date: user.date,
            })
            console.log(newUser)
            newUser.save()
                .then(response => {
                    const newPost = new Post({
                        id: response._id,
                        title: faker.name.title(),
                        text: faker.lorem.text(),
                        likes: Math.floor(Math.random() * 10) + 0
                    })
                    newPost.save()
                        .then(response => {
                            console.log(`Succesfully added ${newPost}`)
                            return res.status(200).json(response);
                        })
                        .catch(err => console.log(err));

                    console.log(`Succesfully added ${newUser}`)
                    return res.status(200).json(response);
                })
                .catch(err => console.log(err))
        })
    });
    return res.send('Profiles and posts succesfully seeded!');
}
