# DETECTIVE

[![A dective](/readme-images/detective.png)](https://detective.stefanbohacek.com/)

## About the game

Detective is a game created by [Stefan Bohacek](https://stefanbohacek.online/@stefan). The rules are fairly simple:

1. When the game starts, players get randomly assigned the role of a Detective, or an Impostor.
2. There is a third role in the game, the Robot, which is a chat bot powered by [BOT libre!](https://www.botlibre.com/).
3. The Impostor will always be paired with another human player, the Detective.
4. Impostor's goal is to deceive the Detective into thinking they are speaking with the Robot (chat bot).
5. As a Detective, player needs to correctly guess whether they are speaking with the Impostor. This is done by saying `you are an impostor` or `you are a robot`.

Play the game a few times, and observe how the Robot answers questions. As an Impostor, you will want to mimic those responses. If you're playing as a Detective, well, good luck, I guess!


[![Not even trying](/readme-images/doing-it-wrong.png)](https://detective.stefanbohacek.com/log?id=878)

The chat bot can learn from its input, but note that this feature can be temporarily disabled at times.


## Join the development (please!)

***Personal note from the game's creator:***

Alright, here's the deal:

I am too busy working on [Botwiki](https://botwiki.org/) and some other projects. I created the Detective game in May 2015 as a small side project, while learning node.js. It was quite popular, getting around 100,000 plays within the first 2-3 days.

I was meaning to add some extra features, but seeing the interest dwindle -- and I am generally a busy person, I ended up mostly abandoning the game.

Fast forward to April 2016. Someone posted the game on reddit and the game was played over 16,000 times in the past day or two. I'm very happy to see people are still interested and I would love to at least add the scoreboard.

Interested in helping? Here's a few assorted notes (I am typing this fast to get the code online while people are still playing the game):

### Install the Detective game locally

1. First, make sure you have node.js installed and a MySQL server running.
2. Go ahead and import the database `detective.sql` saved in the `db` folder.
3. Make sure that you will be able to connect to the DB with this code:
```js
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.DB_PASSWORD,
  database : 'detective_db'
});
```
4. `npm install`
5. `npm install gulp-nodemon gulp-sourcemaps --savedev`
6. `gulp`
7. Open `http://localhost:4000/play` in your browser (or `http://localhost:4000/` to see the landing page, but note that the Play link doesn't *quite* work).
8. To edit the front end JavaScript, go to the `/src/scripts` folder, bump the version of the `scripts.1.x.js` file (also update the file `/views/play.handlebars` so that it loads the updated version).

If you have any questions, try [stefan@stefanbohacek.com](mailto:stefan@stefanbohacek.com), [@stefanbohacek](https://twitter.com/stefanbohacek), or join [botmakers.org](https://botmakers.org/) and look for **@stefan**.

Some of the code really needs to be cleaned up: see hacks such as using a class `shifted-1`, or how some of the code really should be modularized (for example the `badWords`).

Feel free to [open a new issue](https://github.com/stefanbohacek/detective/issues/new) if you notice anything that should be fixed, or would like to see a new feature added.

Thanks!
